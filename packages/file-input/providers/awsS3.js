import { $, sub } from 'startupjs'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

// AWS S3 Configuration from environment variables
const AWS_REGION = process.env.AWS_REGION
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT // Optional: for MinIO, LocalStack, etc.

let s3Client
let bucketName

export function validateSupport () {
  if (!AWS_REGION) {
    throw new Error(ERRORS.awsRegionNotAvailable)
  }
  if (!AWS_ACCESS_KEY_ID) {
    throw new Error(ERRORS.awsAccessKeyNotAvailable)
  }
  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error(ERRORS.awsSecretKeyNotAvailable)
  }
  if (!AWS_S3_BUCKET_NAME) {
    throw new Error(ERRORS.awsBucketNotAvailable)
  }

  // Initialize the S3Client once
  if (!s3Client) {
    console.log('[@startupjs-ui] FileInput: Connecting to AWS S3', {
      region: AWS_REGION,
      bucket: AWS_S3_BUCKET_NAME,
      endpoint: AWS_S3_ENDPOINT
    })

    const clientConfig = {
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    }

    // Support for custom endpoints (like MinIO, LocalStack, etc.)
    if (AWS_S3_ENDPOINT) {
      clientConfig.endpoint = AWS_S3_ENDPOINT
      clientConfig.forcePathStyle = true
    }

    s3Client = new S3Client(clientConfig)
    bucketName = AWS_S3_BUCKET_NAME
  }
}

export async function getFileBlob (fileId, options = {}) {
  validateSupport()

  const { range } = options
  const filePath = await getFilePath(fileId)
  const params = {
    Bucket: bucketName,
    Key: filePath
  }

  try {
    // Get file info first to validate range
    const headCommand = new HeadObjectCommand(params)
    const headResponse = await s3Client.send(headCommand)
    const actualFileSize = headResponse.ContentLength

    if (range) {
      console.log('[AWS S3] Using Range request for optimal streaming:', { fileId, range, filePath })

      // Validate range boundaries
      if (range.start >= actualFileSize || range.start < 0) {
        console.log('[AWS S3] Range start out of bounds:', { start: range.start, actualFileSize })
        throw new Error('Range start out of bounds')
      }

      // Ensure end is within file bounds
      const adjustedEnd = Math.min(range.end, actualFileSize - 1)

      // Ensure end is not before start
      if (adjustedEnd < range.start) {
        console.log('[AWS S3] Invalid range:', { start: range.start, end: adjustedEnd, actualFileSize })
        throw new Error('Invalid range')
      }

      console.log('[AWS S3] Downloading object with range:', {
        start: range.start,
        end: adjustedEnd,
        actualFileSize,
        originalEnd: range.end
      })

      // Download with range
      params.Range = `bytes=${range.start}-${adjustedEnd}`
      const command = new GetObjectCommand(params)
      const response = await s3Client.send(command)

      // Convert stream to buffer
      const chunks = []
      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }

      const result = Buffer.concat(chunks)
      const expectedSize = adjustedEnd - range.start + 1

      console.log('[AWS S3] Range response:', {
        expected: expectedSize,
        actual: result.length,
        start: range.start,
        end: adjustedEnd,
        fileId,
        filePath
      })

      if (result.length === 0) {
        console.warn('[AWS S3] Empty range response - this may indicate a problem')
      }

      return result
    } else {
      // Regular download for non-Range requests
      const command = new GetObjectCommand(params)
      const response = await s3Client.send(command)

      const chunks = []
      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }

      return Buffer.concat(chunks)
    }
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      throw new Error(ERRORS.fileNotFound)
    }
    console.error('[AWS S3] Error downloading object:', error)
    throw error
  }
}

export async function getFileSize (fileId, options) {
  validateSupport()

  const filePath = await getFilePath(fileId)
  const params = {
    Bucket: bucketName,
    Key: filePath
  }

  try {
    const command = new HeadObjectCommand(params)
    const response = await s3Client.send(command)
    return response.ContentLength
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      throw new Error(ERRORS.fileNotFound)
    }
    console.error('[AWS S3] Error getting object size:', error)
    throw error
  }
}

export async function saveFileBlob (fileId, blob, options = {}) {
  validateSupport()
  const filePath = generateFilePath(fileId, options)
  const params = {
    Bucket: bucketName,
    Key: filePath,
    Body: blob
  }

  try {
    // Upload object (overwrites if exists)
    const command = new PutObjectCommand(params)
    await s3Client.send(command)
    console.log('[AWS S3] Object uploaded successfully:', filePath)
  } catch (error) {
    console.error('[AWS S3] Error uploading object:', error)
    throw error
  }
}

export async function deleteFile (fileId, options) {
  validateSupport()

  const filePath = await getFilePath(fileId)
  const params = {
    Bucket: bucketName,
    Key: filePath
  }

  try {
    const command = new DeleteObjectCommand(params)
    await s3Client.send(command)
    console.log('[AWS S3] Object deleted successfully:', filePath)
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      throw new Error(ERRORS.fileNotFound)
    }
    console.error('[AWS S3] Error deleting object:', error)
    throw error
  }
}

async function getFilePath (fileId) {
  const $file = await sub($.files[fileId])
  const file = $file.get()
  return generateFilePath(fileId, file)
}

function generateFilePath (fileId, options) {
  const { filename, path, setUniqName } = options
  const newFilename = setUniqName ? fileId : filename || fileId
  return path ? path + newFilename : newFilename
}

const ERRORS = {
  awsRegionNotAvailable: `
    AWS S3 region is not available.
    Make sure you have configured the AWS_REGION environment variable.
  `,
  awsAccessKeyNotAvailable: `
    AWS access key ID is not available.
    Make sure you have configured the AWS_ACCESS_KEY_ID environment variable.
  `,
  awsSecretKeyNotAvailable: `
    AWS secret access key is not available.
    Make sure you have configured the AWS_SECRET_ACCESS_KEY environment variable.
  `,
  awsBucketNotAvailable: `
    AWS S3 bucket name is not available.
    Make sure you have configured the AWS_S3_BUCKET_NAME environment variable.
  `,
  fileNotFound: `
    File not found in AWS S3.
  `
}
