import type { Meta, StoryObj } from '@storybook/react-native'
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

export const States: Story = {
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
        </StoryStack>
      </StorySection>

      <Div gap={0.5}>
        <Span description>
          The avatar and text sizes stay in sync, which makes the component useful in list rows.
        </Span>
      </Div>
    </StoryStack>
  )
}
