import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Div',
  component: Div
} satisfies Meta<typeof Div>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Layout primitives'>
        <Div row align='center' vAlign='center' gap={1} style={{ justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
          <Span bold>Row container</Span>
          <Button size='s'>Action</Button>
        </Div>
      </StorySection>

      <StorySection title='Pressable container'>
        <Div
          row
          align='center'
          vAlign='center'
          gap={1}
          style={{ justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: '#eef2ff' }}
          onPress={() => {}}
        >
          <Div gap={0.25}>
            <Span bold>Open sheet</Span>
            <Span description>Div can act as a lightweight interactive surface.</Span>
          </Div>
          <Span description>Tap target</Span>
        </Div>
      </StorySection>
    </StoryStack>
  )
}
