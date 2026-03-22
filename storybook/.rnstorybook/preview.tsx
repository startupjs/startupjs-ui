import type { Preview } from '@storybook/react-native'
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds'
import { startupjsParameters, withStartupjsLayout } from '../shared/preview'

const preview: Preview = {
  decorators: [
    withBackgrounds,
    withStartupjsLayout
  ],
  parameters: startupjsParameters
}

export default preview
