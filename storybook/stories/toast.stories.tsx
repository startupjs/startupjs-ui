import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { Button, Card, Div, Span, toast } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

function ToastStates () {
  return (
    <StoryStack>
      <StorySection
        title='Toast triggers'
        description='The toast stack is mounted by UiProvider. Each button below should create a floating toast in the shared overlay area.'
      >
        <InlineRow>
          <Button onPress={() => { toast({ title: 'Saved', text: 'Participant profile updated.' }) }}>
            Info
          </Button>
          <Button onPress={() => { toast({ type: 'success', title: 'Matches ready', text: 'The results page can open now.' }) }}>
            Success
          </Button>
          <Button onPress={() => { toast({ type: 'warning', title: 'Missing number', text: 'Waiting still blocks progress.' }) }}>
            Warning
          </Button>
          <Button onPress={() => { toast({ alert: true, title: 'Sticky note', text: 'This toast stays until closed.' }) }}>
            Alert
          </Button>
        </InlineRow>
      </StorySection>
      <Card style={{ padding: 16 }}>
        <Div gap={0.5}>
          <Span bold>Web check</Span>
          <Span description>
            Trigger one toast and confirm it appears above the app chrome instead of inside the content flow.
          </Span>
        </Div>
      </Card>
    </StoryStack>
  )
}

const meta = {
  title: 'Feedback/Toast',
  component: ToastStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof ToastStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await userEvent.click(canvas.getByRole('button', { name: 'Alert' }))
  await expect(screen.getByRole('status', { name: 'Sticky note' })).toBeVisible()
  await expect(screen.getByRole('button', { name: 'Close toast' })).toBeVisible()
}
void failingFollowup

export const Triggers: Story = {
  tags: ['interaction'],
  render: () => <ToastStates />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Alert' }))
    await waitFor(() => expect(screen.getByText('Sticky note')).toBeVisible())
    await expect(screen.getByText('This toast stays until closed.')).toBeVisible()
  }
}
