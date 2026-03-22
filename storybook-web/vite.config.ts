import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: [
      '@babel/runtime/helpers/classCallCheck',
      '@babel/runtime/helpers/createClass',
      '@babel/runtime/helpers/interopRequireDefault',
      '@babel/runtime/helpers/interopRequireWildcard',
      '@babel/runtime/helpers/objectWithoutProperties',
      '@babel/runtime/helpers/slicedToArray',
      '@babel/runtime/helpers/toConsumableArray',
      '@startupjs/utils/RouterContext',
      'cssxjs/runtime',
      'cssxjs/runtime/teamplay'
    ]
  }
})
