import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Badge, Button, Div, Span } from 'startupjs-ui'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Display/Badge',
  component: Badge
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByTestId('badge-self-testid')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Label variants'>
        <InlineRow>
          <Div data-testid='badge-mentions'>
            <Badge label={3} style={{ alignSelf: 'flex-start' }}>
              <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
                <Span bold>Mentions</Span>
              </Div>
            </Badge>
          </Div>
          <Div data-testid='badge-inbox'>
            <Badge label={18} max={9} style={{ alignSelf: 'flex-start' }}>
              <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
                <Span bold>Inbox</Span>
              </Div>
            </Badge>
          </Div>
          <Div data-testid='badge-live'>
            <Badge variant='dot' style={{ alignSelf: 'flex-start' }}>
              <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
                <Span bold>Live</Span>
              </Div>
            </Badge>
          </Div>
        </InlineRow>
      </StorySection>

      <StorySection title='Icon badge'>
        <Div data-testid='badge-search'>
          <Badge label='2' icon={faHeart}>
            <Button onPress={() => {}}>Search</Button>
          </Badge>
        </Div>
      </StorySection>

      <StorySection title='Host targeting follow-up'>
        <Badge data-testid='badge-self-testid' label={1}>
          <Div style={{ padding: 12, minWidth: 88, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Direct target</Span>
          </Div>
        </Badge>
      </StorySection>

      <StorySection title='Nested content'>
        <Div data-testid='badge-messages'>
          <Badge label={7} style={{ alignSelf: 'flex-start' }}>
            <Div row gap={1} style={{ padding: 16, borderRadius: 12, backgroundColor: '#f9fafb' }}>
              <Span>Messages</Span>
              <Span description>Unread</Span>
            </Div>
          </Badge>
        </Div>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const mentionsBadge = canvas.getByTestId('badge-mentions')
    const inboxBadge = canvas.getByTestId('badge-inbox')
    const liveBadge = canvas.getByTestId('badge-live')
    const searchButton = canvas.getByRole('button', { name: 'Search' })
    const messagesBadge = canvas.getByTestId('badge-messages')

    await expect(canvas.getByText('Mentions')).toBeVisible()
    await expect(canvas.getByText('Inbox')).toBeVisible()
    await expect(canvas.getByText('Live')).toBeVisible()
    await expect(canvas.getByText('Messages')).toBeVisible()
    await expect(searchButton).toBeVisible()
    expect(mentionsBadge.textContent).toContain('3')
    expect(inboxBadge.textContent).toContain('9+')
    expect(messagesBadge.textContent).toContain('7')
    expect(liveBadge.textContent?.includes('Live')).toBe(true)
    expect(liveBadge.textContent?.match(/\d/)).toBeNull()
    expect(canvas.getAllByRole('button')).toHaveLength(1)
  }
}
