import type { Preview } from '@storybook/react-native-web-vite'
import { startupjsParameters, withStartupjsLayout } from '../../storybook/shared/preview'

const preview: Preview = {
  decorators: [withStartupjsLayout],
  parameters: startupjsParameters
}

export default preview
