import {
  getProvider,
  getRegisteredProviders,
  getDefaultProviderName
} from './registry.js'

export async function getFileBlob (storageType, fileId, options) {
  return (await getStorageProvider(storageType)).getFileBlob(fileId, options)
}

export async function getFileSize (storageType, fileId, options) {
  return (await getStorageProvider(storageType)).getFileSize(fileId, options)
}

export async function saveFileBlob (storageType, fileId, blob, options) {
  return (await getStorageProvider(storageType)).saveFileBlob(
    fileId,
    blob,
    options
  )
}

export async function deleteFile (storageType, fileId, options) {
  return (await getStorageProvider(storageType)).deleteFile(fileId, options)
}

export async function getDefaultStorageType () {
  const storage = process.env.DEFAULT_STORAGE_TYPE

  if (storage) return storage

  // Check if any provider registered itself as default
  const defaultName = getDefaultProviderName()
  if (defaultName) return defaultName

  // Fallback: auto-detect based on which providers are registered.
  // Prefer mongo over sqlite when both are available.
  const registered = getRegisteredProviders()
  if (registered.includes('mongo')) return 'mongo'
  if (registered.includes('sqlite')) return 'sqlite'

  throw Error(ERRORS.noDefaultStorageProvider(registered))
}

const moduleCache = {}

async function getStorageProvider (storageType) {
  if (moduleCache[storageType]) return moduleCache[storageType]

  // Look up the provider from the plugin registry
  const theModule = getProvider(storageType)

  if (!theModule) {
    throw Error(
      ERRORS.unsupportedStorageType(storageType, getRegisteredProviders())
    )
  }

  await theModule.validateSupport?.()

  moduleCache[storageType] = theModule
  return theModule
}

const ERRORS = {
  unsupportedStorageType: (storageType, registered) => `
    [@startupjs-ui/file-input] You tried getting file from storageType '${storageType}',
    but it's not registered.
    Currently registered providers: [${registered.join(', ')}].
    Make sure the corresponding provider plugin is installed and imported, e.g.:
      import '@startupjs-ui/file-input-provider-${storageType}'
  `,
  noDefaultStorageProvider: (registered) => `
    [@startupjs-ui/file-input] No default storage provider can be used.
    Currently registered providers: [${registered.join(', ')}].
    Either install a provider plugin (e.g. @startupjs-ui/file-input-provider-mongo)
    or set the DEFAULT_STORAGE_TYPE environment variable.
  `
}
