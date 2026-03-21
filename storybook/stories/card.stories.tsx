import type { Meta, StoryObj } from '@storybook/react-native'
import { Card, Div, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Card',
  component: Card
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Levels and variants'>
        <InlineRow>
          <Card level={0} variant='outlined' style={{ padding: 16, minWidth: 160 }}>
            <Span bold>Outlined</Span>
          </Card>
          <Card level={1} style={{ padding: 16, minWidth: 160 }}>
            <Span bold>Level 1</Span>
          </Card>
          <Card level={4} style={{ padding: 16, minWidth: 160 }}>
            <Span bold>Level 4</Span>
          </Card>
        </InlineRow>
      </StorySection>

      <StorySection title='Pressable card'>
        <Card
          level={2}
          style={{ padding: 16 }}
          onPress={() => {}}
        >
          <Div gap={0.5}>
            <Span bold>Open participant details</Span>
            <Span description>Cards can be used as tappable surfaces.</Span>
          </Div>
        </Card>
      </StorySection>
    </StoryStack>
  )
}
