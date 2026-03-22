import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Progress } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Feedback/Progress',
  component: Progress
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('progressbar', { name: 'Saving participant profile' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Linear'>
        <Progress value={64}>Saving participant profile</Progress>
      </StorySection>

      <StorySection title='Circular'>
        <InlineRow>
          <Progress variant='circular' value={42} width={8}>
            Matching participants
          </Progress>
          <Progress variant='circular' value={88} width={12}>
            Finalizing results
          </Progress>
        </InlineRow>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Saving participant profile')).toBeVisible()
    await expect(canvas.getByText('Matching participants')).toBeVisible()
    await expect(canvas.getByText('Finalizing results')).toBeVisible()
  }
}
