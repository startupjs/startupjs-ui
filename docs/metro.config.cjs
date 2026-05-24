const { getDefaultConfig } = require('startupjs/metro-config')
const path = require('path')

const DISABLE_MINIFIER = process.env.DISABLE_MINIFIER ?? false

const config = getDefaultConfig(__dirname)
const rootDir = path.resolve(__dirname, '..')

if (!config.watchFolders.includes(rootDir)) {
  config.watchFolders.push(rootDir)
}

if (DISABLE_MINIFIER) {
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      compress: false,
      mangle: false
    }
  }
}

module.exports = config
