import type { Meta, StoryObj } from '@storybook/react-native'
import { Progress } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Feedback/Progress',
  component: Progress
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
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
  )
}
