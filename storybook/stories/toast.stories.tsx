import type { Meta, StoryObj } from '@storybook/react-native'
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

export const Triggers: Story = {
  render: () => <ToastStates />
}
