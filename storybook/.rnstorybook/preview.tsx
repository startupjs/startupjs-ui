import { type ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import type { Preview } from '@storybook/react-native'
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds'
import { StartupjsProvider } from 'startupjs'
import { Content, Div, Layout, ScrollView } from 'startupjs-ui'

type StoryLayout = 'centered' | 'content' | 'fullscreen'

function StoryRoot ({
  children,
  layout = 'content'
}: {
  children: ReactNode
  layout?: StoryLayout
}) {
  let content

  switch (layout) {
    case 'centered':
      content = (
        <Div style={{ flex: 1 }} align='center' vAlign='center'>
          {children}
        </Div>
      )
      break
    case 'fullscreen':
      content = <View style={{ flex: 1 }}>{children}</View>
      break
    default:
      content = (
        <ScrollView full>
          <Content padding>{children}</Content>
        </ScrollView>
      )
  }

  return (
    <SafeAreaProvider>
      <StartupjsProvider>
        <Layout>{content}</Layout>
      </StartupjsProvider>
    </SafeAreaProvider>
  )
}

const preview: Preview = {
  decorators: [
    withBackgrounds,
    (Story, context) => (
      <StoryRoot layout={context.parameters.startupjsLayout as StoryLayout | undefined}>
        <Story />
      </StoryRoot>
    )
  ],
  parameters: {
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#ffffff' },
        { name: 'chrome', value: '#f3f4f6' },
        { name: 'ink', value: '#111827' }
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    startupjsLayout: 'content'
  }
}

export default preview
