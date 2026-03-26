import { $ } from 'startupjs'

export default {
  features: {
    enableServer: false,
    enableOAuth2: false,
    enableOffline: false
  },
  client: {
    init () {
      globalThis.$ = $
      globalThis.__STORYBOOK__ = true
    }
  }
}
