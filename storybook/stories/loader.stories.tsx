import type { Meta, StoryObj } from '@storybook/react-native'
import { Loader, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Feedback/Loader',
  component: Loader
} satisfies Meta<typeof Loader>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Sizes'>
        <InlineRow>
          <Loader size='s' />
          <Loader size='m' />
        </InlineRow>
      </StorySection>

      <StorySection title='Different colors'>
        <InlineRow>
          <Loader color='text-description' />
          <Loader color='text-primary' />
        </InlineRow>
      </StorySection>

      <Span description>Useful for async save buttons and loading panels.</Span>
    </StoryStack>
  )
}
