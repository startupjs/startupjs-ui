import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { User, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const USER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#111827"/><text x="48" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">AL</text></svg>'
  )

function StatusDot ({ style }: { style?: any }) {
  return <Div style={[style, { borderRadius: 999, backgroundColor: '#22c55e' }]} />
}

const meta = {
  title: 'Display/User',
  component: User
} satisfies Meta<typeof User>

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
      <StorySection title='Layouts and sizes'>
        <StoryStack>
          <User avatarUrl={USER_IMAGE} name='Ada Lovelace' description='Analytical Engine notes' size='s' status='online' />
          <User avatarUrl={USER_IMAGE} name='Grace Hopper' description='Compiler pioneer' size='m' status='away' />
          <User
            avatarUrl={USER_IMAGE}
            name='Hedy Lamarr'
            description='Frequency hopping inventor with a longer description that wraps to two lines.'
            descriptionNumberOfLines={2}
            size='l'
            avatarPosition='right'
            status='vip'
            statusComponents={{ vip: StatusDot }}
          />
          <User
            avatarUrl={USER_IMAGE}
            name='Margaret Hamilton'
            description='Pressable profile row'
            aria-label='Open Margaret Hamilton'
            onPress={() => {}}
          />
        </StoryStack>
      </StorySection>

      <Div gap={0.5}>
        <Span description>
          The avatar and text sizes stay in sync, which makes the component useful in list rows.
        </Span>
      </Div>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ada Lovelace')).toBeVisible()
    await expect(canvas.getByText('Grace Hopper')).toBeVisible()
    await expect(canvas.getByText('Hedy Lamarr')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Open Margaret Hamilton' })).toBeVisible()
  }
}
