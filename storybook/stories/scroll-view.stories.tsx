import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { ScrollView, Card, Span, Div } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/ScrollView',
  component: ScrollView,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof ScrollView>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <Div style={{ height: 320, borderRadius: 12, backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
      <ScrollView full>
        <StoryStack>
          <StorySection title='Scrollable content'>
            <Card style={{ padding: 16 }}>
              <Span bold>Use `full` so the scroll view fills the viewport.</Span>
            </Card>
          </StorySection>

          <StorySection title='Longer content'>
            <StoryStack>
              <Card style={{ padding: 16 }}>
                <Span>One</Span>
              </Card>
              <Card style={{ padding: 16 }}>
                <Span>Two</Span>
              </Card>
              <Card style={{ padding: 16 }}>
                <Span>Three</Span>
              </Card>
              <Card style={{ padding: 16 }}>
                <Span>Four</Span>
              </Card>
              <Card style={{ padding: 16 }}>
                <Span>Five</Span>
              </Card>
            </StoryStack>
          </StorySection>
        </StoryStack>
      </ScrollView>
    </Div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Use `full` so the scroll view fills the viewport.')).toBeVisible()
    await expect(canvas.getByText('Five')).toBeVisible()
  }
}
