import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformAsync } from '@babel/core'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const reanimatedFilePattern = /node_modules\/react-native-(?:reanimated|worklets)\/.*\.[cm]?[jt]sx?(?:\?.*)?$/

function reanimatedWorkletsBabelPlugin () {
  return {
    name: 'startupjs-ui-storybook-reanimated-worklets-babel',
    enforce: 'pre' as const,
    async transform (code: string, id: string) {
      if (!reanimatedFilePattern.test(id)) return null

      const filename = id.split('?')[0]
      const result = await transformAsync(code, {
        filename,
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        plugins: [
          '@babel/plugin-proposal-export-namespace-from',
          'react-native-worklets/plugin'
        ]
      })

      if (!result?.code) return null

      return {
        code: result.code,
        map: result.map ?? null
      }
    }
  }
}

export default defineConfig({
  server: {
    fs: {
      allow: [
        path.resolve(dirname, '../packages'),
        dirname,
        path.resolve(dirname, '../node_modules')
      ]
    }
  },
  plugins: [reanimatedWorkletsBabelPlugin()],
  resolve: {
    alias: {
      // Storybook web runs through Vite ESM, but Reanimated currently imports this
      // internal validator as a default export from a CommonJS file. Alias just this
      // helper to an ESM-compatible wrapper so the real library can keep running.
      'react-native-reanimated/scripts/validate-worklets-version': path.resolve(
        dirname,
        './shims/reanimated/validate-worklets-version.ts'
      ),
      'react-native-reanimated/scripts/validate-worklets-version.js': path.resolve(
        dirname,
        './shims/reanimated/validate-worklets-version.ts'
      )
    }
  },
  optimizeDeps: {
    exclude: [
      'react-native-reanimated',
      'react-native-worklets'
    ],
    include: [
      '@babel/runtime/helpers/asyncToGenerator',
      '@babel/runtime/helpers/classCallCheck',
      '@babel/runtime/helpers/defineProperty',
      '@babel/runtime/helpers/createClass',
      '@babel/runtime/helpers/interopRequireDefault',
      '@babel/runtime/helpers/interopRequireWildcard',
      '@babel/runtime/helpers/objectDestructuringEmpty',
      '@babel/runtime/helpers/objectWithoutProperties',
      '@babel/runtime/helpers/objectWithoutPropertiesLoose',
      '@babel/runtime/helpers/slicedToArray',
      '@babel/runtime/helpers/toConsumableArray',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-solid-svg-icons/faAngleDown',
      '@fortawesome/free-solid-svg-icons/faAngleUp',
      '@fortawesome/free-solid-svg-icons/faCaretDown',
      '@fortawesome/free-solid-svg-icons/faCheck',
      '@fortawesome/free-solid-svg-icons/faEye',
      '@fortawesome/free-solid-svg-icons/faEyeSlash',
      '@fortawesome/free-solid-svg-icons/faGripVertical',
      '@fortawesome/free-solid-svg-icons/faMinus',
      '@fortawesome/free-solid-svg-icons/faPlus',
      '@fortawesome/free-solid-svg-icons/faStar',
      '@fortawesome/free-solid-svg-icons/faTimesCircle',
      '@fortawesome/react-native-fontawesome',
      '@ptomasroos/react-native-multi-slider',
      '@react-native-picker/picker',
      '@startupjs/utils/RouterContext',
      'cssxjs/runtime',
      'cssxjs/runtime/teamplay',
      'randomcolor',
      'react-native-collapsible',
      'react-native-svg',
      'react-native-tab-view',
      'semver/functions/prerelease.js',
      'semver/functions/satisfies.js'
    ]
  }
})
