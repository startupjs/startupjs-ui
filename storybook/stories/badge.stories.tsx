import type { Meta, StoryObj } from '@storybook/react-native'
import { Badge, Button, Div, Span } from 'startupjs-ui'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Display/Badge',
  component: Badge
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Label variants'>
        <InlineRow>
          <Badge label={3}>
            <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
              <Span bold>Mentions</Span>
            </Div>
          </Badge>
          <Badge label={18} max={9}>
            <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
              <Span bold>Inbox</Span>
            </Div>
          </Badge>
          <Badge variant='dot'>
            <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
              <Span bold>Live</Span>
            </Div>
          </Badge>
        </InlineRow>
      </StorySection>

      <StorySection title='Icon badge'>
        <Badge label='2' icon={faHeart}>
          <Button>Search</Button>
        </Badge>
      </StorySection>

      <StorySection title='Nested content'>
        <Badge label={7}>
          <Div row gap={1} style={{ padding: 16, borderRadius: 12, backgroundColor: '#f9fafb' }}>
            <Span>Messages</Span>
            <Span description>Unread</Span>
          </Div>
        </Badge>
      </StorySection>
    </StoryStack>
  )
}
