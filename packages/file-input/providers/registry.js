/**
 * Provider Registry for FileInput storage backends.
 *
 * Each provider plugin calls `registerProvider(name, provider)` when imported.
 * The core `providers/index.js` then resolves providers through the registry
 * instead of using hardcoded dynamic imports.
 *
 * Provider interface (each function is async):
 *   - validateSupport()
 *   - getFileBlob(fileId, options)
 *   - getFileSize(fileId, options)
 *   - saveFileBlob(fileId, blob, options)
 *   - deleteFile(fileId, options)
 */

const registry = {}

/**
 * Register a storage provider plugin.
 *
 * @param {string}   name     Unique provider name, e.g. 'mongo', 'sqlite', 's3', 'azureblob'.
 * @param {object}   provider Object implementing the provider interface.
 * @param {object}   [opts]
 * @param {boolean}  [opts.isDefault]  If true, sets this provider as the default when
 *                                      no DEFAULT_STORAGE_TYPE env var is set.
 */
export function registerProvider (name, provider, opts) {
  if (!name) throw Error('[file-input] registerProvider: name is required')
  if (!provider) { throw Error('[file-input] registerProvider: provider object is required') }
  registry[name] = { provider, isDefault: opts?.isDefault ?? false }
}

/**
 * Look up a previously registered provider by name.
 *
 * @param {string} name
 * @returns {object|undefined} The provider module or undefined if not registered.
 */
export function getProvider (name) {
  return registry[name]?.provider
}

/**
 * Return the names of all registered providers.
 *
 * @returns {string[]}
 */
export function getRegisteredProviders () {
  return Object.keys(registry)
}

/**
 * Return the name of the provider marked as default (via `isDefault: true`),
 * or undefined if none.
 *
 * @returns {string|undefined}
 */
export function getDefaultProviderName () {
  for (const name in registry) {
    if (registry[name].isDefault) return name
  }
}
