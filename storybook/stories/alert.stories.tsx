import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Alert, Button } from 'startupjs-ui'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Feedback/Alert',
  component: Alert
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('alert')).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Close alert' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
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
          title='Export issue'
          variant='error'
          onClose={() => {}}
        >
          The export failed and can be retried later.
        </Alert>
        <Alert
          title='Review the match list'
          icon={faCircleInfo}
          variant='warning'
          onClose={() => {}}
          renderActions={() => (
            <InlineRow>
              <Button size='s' onPress={() => {}}>Save alert</Button>
              <Button size='s' variant='outline' onPress={() => {}}>Dismiss alert</Button>
            </InlineRow>
          )}
        >
          This uses the same action placement as the real organizer UI.
        </Alert>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Info')).toBeVisible()
    await expect(canvas.getByText('Warning')).toBeVisible()
    await expect(canvas.getByText('Success')).toBeVisible()
    await expect(canvas.getByText('Error')).toBeVisible()
    await expect(canvas.getByText('Export issue')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Save alert' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Dismiss alert' })).toBeVisible()
    expect(canvas.getAllByRole('button')).toHaveLength(3)
  }
}
