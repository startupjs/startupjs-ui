import { $, sub } from 'startupjs'
import { getPlugin } from 'startupjs/registry'
import { deleteFile, getDefaultStorageType, saveFileBlob } from '../providers/index.js'
import { DEFAULT_FILE_COLLECTIONS, FILES_PLUGIN_NAME } from '../constants.js'

export default async function uploadBuffer (buff, options = {}) {
  // collection: the collection holding the file METADATA doc (blobs go to the
  // storage provider keyed by fileId regardless of collection). Defaults to
  // 'files'; pass a custom collection to keep special-purpose uploads out of
  // the user-facing files listing.
  // SECURITY: server-side writes bypass access control, so `collection` must be
  // declared in the files plugin's `collections` isomorphic allowlist -- even a
  // careless passthrough of request data can then only ever reach collections
  // explicitly registered as file collections. The built-in upload route
  // always writes to 'files'.
  let { fileId, meta = {}, collection = 'files' } = options
  const allowedCollections = getAllowedCollections()
  if (!allowedCollections.includes(collection)) {
    throw new Error(
      `[ui/files] uploadBuffer: collection '${collection}' is not registered as a file collection. ` +
      'Declare it in startupjs.config.js: ' +
      `plugins: { files: { isomorphic: { collections: [${[...allowedCollections, collection].map(c => `'${c}'`).join(', ')}] } } }`
    )
  }

  let storageType = meta.storageType
  try {
    storageType ??= await getDefaultStorageType()
  } catch (err) {
    console.error(err)
    throw new Error('Error getting default storage type')
  }

  const create = !fileId
  if (!fileId) fileId = $.id()

  // try to save file to sqlite first to do an early exit if it fails
  try {
    await saveFileBlob(storageType, fileId, buff, meta)
  } catch (err) {
    console.error(err)
    throw new Error('Error saving file')
  }

  if (create) {
    const doc = { id: fileId, ...meta, storageType }
    // if some of the meta fields were undefined, remove them from the doc
    for (const key in meta) {
      if (meta[key] == null) delete doc[key]
    }
    if (collection === 'files') {
      await $.files.addNew(doc)
    } else {
      // custom collections have no FilesModel — add with the same timestamps.
      // (NOT feature-detected via `$col.addNew`: signals are callable proxies,
      // so that property is a child signal with typeof 'function' everywhere.)
      const now = Date.now()
      await $[collection].add({ createdAt: now, updatedAt: now, ...doc })
    }
  } else {
    const $file = await sub($[collection][fileId])

    // when changing storageType we should delete the file from the old storageType
    const oldStorageType = $file.storageType.get()
    if (oldStorageType !== storageType) {
      try {
        await deleteFile(oldStorageType, fileId)
      } catch (err) {
        console.error(err)
        throw new Error(`Error deleting file from old storageType ${oldStorageType}`)
      }
    }

    const doc = { ...$file.get(), ...meta, storageType, updatedAt: Date.now() }
    // if some of the meta fields were undefined, remove them from the doc
    for (const key in meta) {
      if (meta[key] == null) delete doc[key]
    }
    await $file.set(doc)
  }
  return fileId
}

// the files plugin's `collections` isomorphic option. Falls back to just
// ['files'] when the plugin options aren't readable (e.g. registry not
// initialized in a standalone script) -- strict in the right direction:
// the default collection keeps working, custom ones require the declared
// allowlist.
function getAllowedCollections () {
  try {
    const { collections } = getPlugin(FILES_PLUGIN_NAME).optionsByEnv.isomorphic || {}
    if (Array.isArray(collections)) return collections
  } catch {}
  return DEFAULT_FILE_COLLECTIONS
}
