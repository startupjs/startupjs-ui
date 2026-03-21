/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, Div, Span, alert, confirm, prompt } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const DialogStorySurface = () => (
  <StoryStack>
    <StorySection
      title='Dialog helpers'
      description='These stories exercise the globally mounted dialog helpers through UiProvider.'
    >
      <InlineRow>
        <Button
          onPress={() => {
            alert({
              title: 'Delete participant?',
              message: 'This action can be reversed later in the story.'
            })
          }}
        >Open alert</Button>
        <Button
          onPress={async () => {
            await confirm({
              title: 'Publish results',
              message: 'Participants will see their matches immediately.'
            })
          }}
        >Open confirm</Button>
        <Button
          onPress={async () => {
            await prompt({
              title: 'Rename event',
              message: 'Set a new title for this event.',
              defaultValue: 'Spring meetup'
            })
          }}
        >Open prompt</Button>
      </InlineRow>
    </StorySection>
    <Div gap={0.5}>
      <Span description>
        Verify that dialogs stay functional after switching between stories and returning here.
      </Span>
    </Div>
  </StoryStack>
)

const meta = {
  title: 'Feedback/Dialogs',
  component: DialogStorySurface,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof DialogStorySurface>

export default meta

type Story = StoryObj<typeof meta>

export const Helpers: Story = {
  render: () => <DialogStorySurface />
}
