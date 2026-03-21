import type { Meta, StoryObj } from '@storybook/react-native'
import { Alert, Button } from 'startupjs-ui'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Feedback/Alert',
  component: Alert
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Variants'>
        <StoryStack>
          <Alert title='Info' variant='info'>
            The next round starts in five minutes.
          </Alert>
          <Alert title='Warning' variant='warning'>
            One participant is still missing a profile photo.
          </Alert>
          <Alert title='Success' variant='success'>
            Results were published successfully.
          </Alert>
          <Alert title='Error' variant='error'>
            The export failed and should be retried.
          </Alert>
        </StoryStack>
      </StorySection>

      <StorySection title='Custom actions'>
        <Alert
          title='Review the match list'
          icon={faCircleInfo}
          variant='warning'
          onClose={() => {}}
          renderActions={() => (
            <InlineRow>
              <Button size='s' variant='flat'>Save</Button>
              <Button size='s' variant='outlined'>Dismiss</Button>
            </InlineRow>
          )}
        >
          This uses the same action placement as the real organizer UI.
        </Alert>
      </StorySection>
    </StoryStack>
  )
}
