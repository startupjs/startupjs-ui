import type { Meta, StoryObj } from '@storybook/react-native'
import { Avatar, Div, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const AVATAR_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#111827"/><text x="64" y="76" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#ffffff">AL</text></svg>'
  )

function StatusDot ({ style }: { style?: any }) {
  return <Div style={[style, { borderRadius: 999, backgroundColor: '#f59e0b' }]} />
}

const meta = {
  title: 'Display/Avatar',
  component: Avatar
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Initials and sizes'>
        <InlineRow>
          <Avatar size='s'>Ada Lovelace</Avatar>
          <Avatar size='m'>Grace Hopper</Avatar>
          <Avatar size='l'>Hedy Lamarr</Avatar>
        </InlineRow>
      </StorySection>

      <StorySection title='Image fallback and status'>
        <InlineRow>
          <Avatar src={AVATAR_SRC} status='online'>
            Ada Lovelace
          </Avatar>
          <Avatar status='away'>Grace Hopper</Avatar>
          <Avatar status='vip' statusComponents={{ vip: StatusDot }}>
            Hedy Lamarr
          </Avatar>
        </InlineRow>
      </StorySection>

      <Div gap={0.5}>
        <Span description>
          The `src` example uses a data URI so the story stays self-contained on web.
        </Span>
      </Div>
    </StoryStack>
  )
}
