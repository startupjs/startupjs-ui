import { createPlugin } from 'startupjs/registry'
import * as provider from './provider.js'

export default createPlugin({
  name: 'file-input-provider-sqlite',
  enabled: true,
  order: 'system ui',
  server: () => ({
    fileStorageProviders: () => ({
      sqlite: provider
    })
  })
})
