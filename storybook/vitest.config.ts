import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import viteConfig from './vite.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(viteConfig, defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      storybookScript: 'yarn storybook --ci',
      tags: {
        include: ['interaction']
      }
    })
  ],
  test: {
    fileParallelism: false,
    testTimeout: 30000,
    name: 'storybook',
    browser: {
      enabled: true,
      provider: playwright({}),
      headless: true,
      instances: [{ browser: 'chromium' }]
    },
    setupFiles: ['./.storybook/vitest.setup.ts']
  }
}))
