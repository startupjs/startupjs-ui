import { createPlugin } from 'startupjs/registry'
import * as provider from './provider.js'

export default createPlugin({
  name: 'file-input-provider-s3',
  enabled: true,
  order: 'system ui',
  server: () => ({
    fileStorageProviders: () => ({
      s3: provider
    })
  })
})
