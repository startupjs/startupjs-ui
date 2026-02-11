/**
 * AWS S3 storage provider plugin for @startupjs-ui/file-input.
 *
 * Importing this module registers the 's3' provider in the file-input
 * provider registry, making it available automatically.
 *
 * Usage:
 *   // In your server entry or config:
 *   import '@startupjs-ui/file-input-provider-s3'
 */
import { registerProvider } from '@startupjs-ui/file-input/providers/registry'
import * as provider from './provider.js'

registerProvider('s3', provider, { isDefault: false })
