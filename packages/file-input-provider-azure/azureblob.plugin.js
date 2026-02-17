import { createPlugin } from 'startupjs/registry'
import * as provider from './provider.js'

export default createPlugin({
  name: 'file-input-provider-azureblob',
  enabled: true,
  order: 'system ui',
  server: () => ({
    fileStorageProviders: () => ({
      azureblob: provider
    })
  })
})
