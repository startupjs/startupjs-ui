import type { Meta, StoryObj } from '@storybook/react-native'
import { Br, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Br',
  component: Br
} satisfies Meta<typeof Br>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Standard spacing'>
        <Div style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
          <Span bold>Top line</Span>
          <Br />
          <Span description>Bottom line</Span>
        </Div>
      </StorySection>

      <StorySection title='Half and multi-line spacing'>
        <Div gap={0.5} style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
          <Span bold>Half step</Span>
          <Br half />
          <Span description>Next line</Span>
          <Br lines={2} />
          <Span description>Two-line gap</Span>
        </Div>
      </StorySection>
    </StoryStack>
  )
}
