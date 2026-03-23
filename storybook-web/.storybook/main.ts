import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-native-web-vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const packagesDir = path.resolve(dirname, '../../packages')
const localPackageNames = fs.readdirSync(packagesDir)
  .map(dir => path.join(packagesDir, dir, 'package.json'))
  .filter(file => fs.existsSync(file))
  .map(file => JSON.parse(fs.readFileSync(file, 'utf8')).name)
  .filter(Boolean)
const transpiledModules = [
  ...localPackageNames,
  'react-native-reanimated',
  'react-native-worklets'
]

const config: StorybookConfig = {
  stories: ['../../storybook/stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest'
  ],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      modulesToTranspile: transpiledModules,
      pluginReactOptions: {
        babel: {
          presets: [
            ['babel-preset-expo', { disableImportExportTransform: true }],
            [
              'startupjs/babel',
              {
                docgen: true,
                compileCssImports: true,
                cssFileExtensions: ['styl', 'css']
              }
            ]
          ],
          plugins: [
            '@babel/plugin-proposal-export-namespace-from',
            'react-native-worklets/plugin'
          ]
        },
        include: [
          /storybook\/stories\/.*\.[jt]sx?$/,
          /storybook\/shared\/.*\.[jt]sx?$/,
          /packages\/.*\.[jt]sx?$/
        ]
      }
    }
  }
}

export default config
