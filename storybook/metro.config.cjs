const path = require('path')
const { getDefaultConfig } = require('startupjs/metro-config')
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')

const config = getDefaultConfig(__dirname)

module.exports = withStorybook(config, {
  configPath: path.resolve(__dirname, './.rnstorybook')
})
