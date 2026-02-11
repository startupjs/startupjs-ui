/**
 * Azure Blob Storage provider plugin for @startupjs-ui/file-input.
 *
 * Importing this module registers the 'azureblob' provider in the file-input
 * provider registry, making it available automatically.
 *
 * Usage:
 *   // In your server entry or config:
 *   import '@startupjs-ui/file-input-provider-azure'
 */
import { registerProvider } from '@startupjs-ui/file-input/providers/registry'
import * as provider from './provider.js'

registerProvider('azureblob', provider, { isDefault: false })
