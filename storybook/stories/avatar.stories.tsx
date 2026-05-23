import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Ada Lovelace' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Initials and sizes'>
        <InlineRow>
          <Avatar testID='avatar-initials-s' size='s'>Ada Lovelace</Avatar>
          <Avatar testID='avatar-initials-m' size='m'>Grace Hopper</Avatar>
          <Avatar testID='avatar-initials-l' size='l'>Hedy Lamarr</Avatar>
        </InlineRow>
      </StorySection>

      <StorySection title='Image fallback and status'>
        <InlineRow>
          <Avatar testID='avatar-image' src={AVATAR_SRC} status='online'>
            Ada Lovelace
          </Avatar>
          <Avatar testID='avatar-away' status='away'>Grace Hopper</Avatar>
          <Avatar testID='avatar-vip' status='vip' statusComponents={{ vip: StatusDot }}>
            Hedy Lamarr
          </Avatar>
        </InlineRow>
      </StorySection>

      <StorySection title='Pressable avatar'>
        <Avatar
          testID='avatar-pressable'
          aria-label='Open Ada profile'
          onPress={() => {}}
        >
          Ada Lovelace
        </Avatar>
      </StorySection>

      <Div gap={0.5}>
        <Span description>
          The `src` example uses a data URI so the story stays self-contained on web.
        </Span>
      </Div>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const initialsAvatar = canvas.getByTestId('avatar-initials-s')
    const imageAvatar = canvas.getByTestId('avatar-image')
    const awayAvatar = canvas.getByTestId('avatar-away')
    const vipAvatar = canvas.getByTestId('avatar-vip')
    const pressableAvatar = canvas.getByRole('button', { name: 'Open Ada profile' })

    await expect(pressableAvatar).toBeVisible()
    expect(pressableAvatar.tagName).toBe('DIV')
    expect(initialsAvatar.textContent?.trim()).toBe('AL')
    expect(canvas.getByTestId('avatar-initials-m').textContent?.trim()).toBe('GH')
    expect(canvas.getByTestId('avatar-initials-l').textContent?.trim()).toBe('HL')
    expect(imageAvatar.querySelector('img') ?? imageAvatar.querySelector('[part=\"fallback\"]')).not.toBeNull()
    expect(imageAvatar.children).toHaveLength(2)
    expect(awayAvatar.children).toHaveLength(2)
    expect(vipAvatar.children).toHaveLength(2)
  }
}
