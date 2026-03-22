import { StoryRoot, type StoryLayout } from './StoryRoot'

export const startupjsParameters = {
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

export function withStartupjsLayout (Story: any, context: any) {
  return (
    <StoryRoot layout={context.parameters.startupjsLayout as StoryLayout | undefined}>
      <Story />
    </StoryRoot>
  )
}
