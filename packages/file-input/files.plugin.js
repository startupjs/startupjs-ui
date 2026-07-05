import { $, BASE_URL, accessControl, serverOnly, Signal, sub } from 'startupjs'
import { createPlugin } from 'startupjs/registry'
import busboy from 'busboy'
import sharp from 'sharp'
import { DEFAULT_FILE_COLLECTIONS, DELETE_FILE_URL, FILES_PLUGIN_NAME, GET_FILE_URL, getDeleteFileUrl, getFileUrl, getUploadFileUrl, UPLOAD_SINGLE_FILE_URL } from './constants.js'
import { deleteFile, getDefaultStorageType, getFileBlob, getFileSize } from './providers/index.js'
import { uploadBuffer } from './server/index.js'

export default createPlugin({
  name: FILES_PLUGIN_NAME,
  enabled: true,
  order: 'system ui',
  // collections: allowlist of collections which may hold file metadata docs --
  // the ONLY collections uploadBuffer's `collection` option accepts. Default
  // ['files']. If you override it, keep 'files' in the list, otherwise the
  // built-in upload route (which always writes to 'files') stops working.
  isomorphic: ({ collections = DEFAULT_FILE_COLLECTIONS } = {}, plugin) => {
    if (!collections.includes('files')) {
      console.warn('[ui/files] the `collections` isomorphic option does not include \'files\' -- ' +
        'the built-in upload route always writes to \'files\' and will error. ' +
        'Did you mean to APPEND your collection instead of replacing the list?')
    }
    return {
      models: models => {
        return {
          ...models,
          files: {
            default: FilesModel,
            schema,
            ...models.files,
            access: accessControl(models.files?.access || {
              read: ({ session, docId, doc }) => {
                const canRead = getServerOptions(plugin).canRead
                if (!canRead) return true
                return canRead({
                  source: 'model',
                  session,
                  fileId: docId,
                  file: doc
                })
              }
            }, { force: true })
          },
          'files.*': {
            default: FileModel,
            ...models['files.*']
          }
        }
      }
    }
  },
  server: (options = {}) => ({
    serverRoutes: expressApp => {
      expressApp.get(GET_FILE_URL, async (req, res) => {
        let { fileId } = req.params

        // Extract video file detection early for Range support
        const isVideoRequest = req.url.includes('.mp4') || req.url.includes('.mov') || req.url.includes('.avi')
        // if id has extension, remove it
        // (extension is sometimes added for client libraries to properly handle the file)
        fileId = fileId.replace(/\.[^.]+$/, '')
        // url might have ?download=true which means we should force download
        const download = (req.query?.download != null)
        const $file = await sub($.files[fileId])
        const file = $file.get()
        if (!file) return res.status(404).send(ERRORS.fileNotFound)
        const { mimeType, storageType, filename, updatedAt } = file
        if (!mimeType) return res.status(500).send(ERRORS.fileMimeTypeNotSet)
        const isVideo = mimeType.startsWith('video/') || isVideoRequest
        if (!storageType) return res.status(500).send(ERRORS.fileStorageTypeNotSet)
        if (!await isAllowed(options.canRead, {
          source: 'api',
          req,
          session: req.session,
          fileId,
          file
        }, res)) return

        // handle client-side caching of files
        const clientEtag = req.get('If-None-Match')
        const etag = `"${updatedAt}"`
        // lastModified and ifModifiedSince both use UTC time with seconds precision
        const ifModifiedSince = req.get('If-Modified-Since')
        const lastModified = new Date(updatedAt).toUTCString()

        function setCacheHeaders () {
          res.setHeader('Etag', etag)
          res.setHeader('Last-Modified', lastModified)
          if (process.env.NODE_ENV === 'production') {
            res.setHeader('Cache-Control', `public, max-age=${5 * 60}`) // cache on client for 5 mins
          } else {
            res.setHeader('Cache-Control', 'no-cache') // always validate cache in development
          }
          // the following headers are set by expo (metro) dev server.
          // We don't want them since we're setting our own cache headers
          // and a single Cache-Control header fully replaces them.
          res.removeHeader('Pragma')
          res.removeHeader('Surrogate-Control')
          res.removeHeader('Expires')

          // Add Range support for video files (required for iOS AVPlayer)
          if (isVideo) {
            res.setHeader('Accept-Ranges', 'bytes')
          }
        }

        if (
          clientEtag === etag ||
          (ifModifiedSince && +new Date(ifModifiedSince) >= +new Date(lastModified))
        ) {
          setCacheHeaders()
          return res.status(304).send() // Not Modified
        }

        try {
          // Performance optimization: True streaming for Range requests
          if (isVideo && req.headers.range) {
            const range = req.headers.range
            console.log('[StartupJS Files] Processing Range request with TRUE streaming:', { fileId, range })

            try {
              const parts = range.replace(/bytes=/, '').split('-')
              const start = parseInt(parts[0], 10) || 0

              // Get file size efficiently without loading full file
              const fileSize = await getFileSize(storageType, fileId)
              let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

              console.log('[StartupJS Files] Processing range:', { range, start, end, fileSize, parts })

              // Fix off-by-one error in range validation
              if (start >= fileSize || start > end) {
                console.log('[StartupJS Files] Invalid range:', { start, end, fileSize })
                res.status(416)
                res.setHeader('Content-Range', `bytes */${fileSize}`)
                return res.send('Range Not Satisfiable')
              }

              // Adjust end to file bounds
              if (end >= fileSize) {
                end = fileSize - 1
              }

              // TRUE STREAMING: get only the requested range from storage
              const rangeBlob = await getFileBlob(storageType, fileId, { start, end })

              // Handle empty responses from MongoDB GridFS
              // This can happen for the last byte due to GridFS chunking behavior
              if (rangeBlob.length === 0) {
                // For the last byte, return a fake byte to satisfy video players
                // HTTP 416 for last byte can prevent video playback entirely
                if (start === fileSize - 1) {
                  console.log('[StartupJS Files] Last byte unavailable, returning fake byte for video compatibility:', { start, end, fileSize })
                  res.status(206)
                  res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`)
                  res.setHeader('Content-Length', '1')
                  res.type(mimeType)
                  setCacheHeaders()
                  return res.send(Buffer.from([0x00])) // Fake last byte for video compatibility
                }

                console.log('[StartupJS Files] Empty response from GridFS, returning 416:', { start, end, fileSize })
                res.status(416)
                res.setHeader('Content-Range', `bytes */${fileSize}`)
                return res.send('Range Not Satisfiable')
              }

              const chunksize = (end - start) + 1

              res.status(206) // Partial Content
              res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`)
              res.setHeader('Content-Length', rangeBlob.length.toString())
              res.type(mimeType)

              if (download) res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
              setCacheHeaders()

              console.log('[StartupJS Files] Sending TRUE streaming response:', {
                start,
                end,
                chunksize,
                totalSize: fileSize,
                actualChunkSize: rangeBlob.length,
                contentLength: rangeBlob.length.toString(),
                isLastByte: start === fileSize - 1
              })
              return res.send(rangeBlob)
            } catch (err) {
              console.error('[StartupJS Files] Range request error:', err)
              // Fallback to full file if range processing fails
            }
          }

          // Load file for non-Range requests (download functionality preserved)
          const blob = await getFileBlob(storageType, fileId)
          const fileBuffer = (blob instanceof Buffer) ? blob : Buffer.from(blob) // avoid unnecessary copy

          // set the Content-Type header
          res.type(mimeType)

          // force the file to be downloaded by setting the Content-Disposition header
          if (download) res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

          setCacheHeaders()

          // send the actual file
          res.send(fileBuffer)
        } catch (err) {
          console.error(err)
          res.status(500).send('Error getting file')
        }
      })

      // this handles both creating and updating a file
      expressApp.post(UPLOAD_SINGLE_FILE_URL, async (req, res) => {
        let { fileId, storageType } = req.params
        try {
          storageType ??= await getDefaultStorageType()
        } catch (err) {
          console.error(err)
          return res.status(500).send('Error getting default storage type')
        }
        const bb = busboy({ headers: req.headers })

        let blob
        let meta
        bb.on('file', (fieldname, file, { filename, mimeType, encoding }) => {
          if (blob) return res.status(500).send('Only one file is allowed')

          const buffers = []
          let stream = file

          if (mimeType.startsWith('image/')) {
            // If it's an image, pipe it through sharp for resizing and conversion
            stream = file.pipe(sharp()
              .rotate()
              .resize(1000, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
              })
              .toFormat('jpeg', { quality: 80 })) // Convert to JPEG with 85% quality

            filename = filename.replace(/\.[^.]+$/, '.jpg') // Change extension to .jpg
            mimeType = 'image/jpeg'
          }

          // Surface stream errors (e.g. sharp failing to decode a corrupt or
          // forged "image/*" upload) as a 400 instead of letting an unhandled
          // 'error' event crash the whole server process. This is essential for
          // public/untrusted uploads, where a single garbage payload with an
          // image mime type would otherwise take the server down. Attach to the
          // source busboy stream and, for images, the sharp stream too — an
          // unhandled 'error' on either is fatal.
          const onStreamError = err => {
            console.error('[StartupJS Files] Upload stream error:', err)
            if (!res.headersSent) res.status(400).send('Invalid file data')
          }
          file.on('error', onStreamError)
          if (stream !== file) stream.on('error', onStreamError)

          // Regardless of whether it's an image or not, collect the data
          stream.on('data', data => buffers.push(data))

          stream.on('end', async () => {
            // a stream 'error' (e.g. sharp rejecting a forged image) may have
            // already responded (onStreamError sent 400), but the source
            // busboy stream still fires 'end' — bail before double-sending,
            // otherwise the res.json below throws ERR_HTTP_HEADERS_SENT and,
            // being an unhandled async error, crashes the whole server process.
            // A single forged "image/*" upload with garbage bytes would
            // otherwise take the server down.
            if (res.headersSent) return
            let blob = Buffer.concat(buffers)
            meta = { filename, mimeType, encoding, storageType }
            if (!blob) return res.status(500).send('No file was uploaded')

            // extract extension from filename
            console.log('meta.filename', meta.filename)
            const extension = meta.filename?.match(/\.([^.]+)$/)?.[1]
            if (extension) meta.extension = extension
            try {
              const file = fileId ? (await sub($.files[fileId])).get() : undefined
              const accessContext = {
                source: 'api',
                req,
                session: req.session,
                fileId,
                file,
                blob,
                meta
              }
              if (!await isAllowed(options.canUpload, accessContext, res)) return

              if (options.transformUpload) {
                const transformed = await options.transformUpload(accessContext)
                if (transformed) {
                  if ('fileId' in transformed) fileId = transformed.fileId
                  if ('blob' in transformed) blob = transformed.blob
                  if ('meta' in transformed) meta = transformed.meta
                }
              }

              fileId = await uploadBuffer(blob, { fileId, meta })
            } catch (err) {
              console.error(err)
              return res.status(500).send(err.message)
            }
            console.log(`Uploaded file to ${storageType}`, fileId)
            res.json({ fileId })
          })
        })

        return req.pipe(bb)
      })

      expressApp.post(DELETE_FILE_URL, async (req, res) => {
        const { fileId } = req.params
        const $file = await sub($.files[fileId])
        const file = $file.get()
        if (!file) return res.status(404).send(ERRORS.fileNotFound)
        const { storageType } = file
        if (!storageType) return res.status(500).send(ERRORS.fileStorageTypeNotSet)
        if (!await isAllowed(options.canDelete, {
          source: 'api',
          req,
          session: req.session,
          fileId,
          file
        }, res)) return
        try {
          await deleteFile(storageType, fileId)
          await $file.del()
          res.json({ fileId })
        } catch (err) {
          console.error(err)
          res.status(500).send('Error deleting file')
        }
      })
    }
  })
})

function getServerOptions (plugin) {
  return plugin.optionsByEnv?.server || {}
}

async function isAllowed (hook, context, res) {
  if (!hook) return true
  try {
    if (await hook(context)) return true
  } catch (err) {
    console.error(err)
    res.status(500).send('Error checking file access')
    return false
  }
  res.status(403).send(ERRORS.accessDenied)
  return false
}

const schema = {
  storageType: { type: 'string', required: true },
  mimeType: { type: 'string', required: true },
  filename: { type: 'string' }, // original filename with extension
  encoding: { type: 'string' },
  extension: { type: 'string' },
  createdAt: { type: 'number', required: true },
  // updatedAt is used to determine whether the underlying file
  // stored in the storageType provider has changed.
  // This is used to properly cache files on the client side.
  updatedAt: { type: 'number', required: true }
}

class FilesModel extends Signal {
  async addNew (file) {
    const now = Date.now()
    return await this.add({
      ...file,
      createdAt: now,
      updatedAt: now
    })
  }

  getUrl (fileId, extension) {
    return getFileUrlWithAccessToken(fileId, extension)
  }

  getDownloadUrl (fileId, extension) {
    return getFileUrlWithAccessToken(fileId, extension, { download: true })
  }

  getUploadUrl (fileId) {
    return BASE_URL + getUploadFileUrl(fileId)
  }

  getDeleteUrl (fileId) {
    return BASE_URL + getDeleteFileUrl(fileId)
  }
}

class FileModel extends Signal {
  getUrl () {
    return getFileUrlWithAccessToken(this.getId(), this.extension.get())
  }

  getDownloadUrl () {
    return getFileUrlWithAccessToken(this.getId(), this.extension.get(), { download: true })
  }

  getUploadUrl () {
    return BASE_URL + getUploadFileUrl(this.getId())
  }

  getDeleteUrl () {
    return BASE_URL + getDeleteFileUrl(this.getId())
  }

  getBlob = serverOnly(function () {
    return getFileBlob(this.storageType.get(), this.getId())
  })
}

function getFileUrlWithAccessToken (fileId, extension, query = {}) {
  const token = $.session.token.get()
  return addQuery(BASE_URL + getFileUrl(fileId, extension), {
    ...query,
    ...(token ? { access_token: token } : {})
  })
}

function addQuery (url, query) {
  const search = Object.entries(query)
    .filter(([, value]) => value != null && value !== false)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
  if (!search) return url
  return url + (url.includes('?') ? '&' : '?') + search
}

const ERRORS = {
  accessDenied: 'Access denied',
  fileNotFound: 'File not found',
  fileMimeTypeNotSet: 'File mimeType is not set. This should never happen',
  fileStorageTypeNotSet: 'File storageType is not set. This should never happen'
}
