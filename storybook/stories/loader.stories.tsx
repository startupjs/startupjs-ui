import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Loader, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Feedback/Loader',
  component: Loader
} satisfies Meta<typeof Loader>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('progressbar', { name: 'Paused hidden loader' })).not.toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Sizes'>
        <InlineRow>
          <Loader aria-label='Small loader' size='s' />
          <Loader aria-label='Large loader' size='m' />
        </InlineRow>
      </StorySection>

      <StorySection title='Different colors'>
        <InlineRow>
          <Loader aria-label='Secondary loader' color='text-description' />
          <Loader aria-label='Primary loader' color='text-primary' />
        </InlineRow>
      </StorySection>

      <StorySection title='Animating and stopped states'>
        <InlineRow>
          <Loader aria-label='Paused visible loader' animating={false} hidesWhenStopped={false} />
          <Loader aria-label='Paused hidden loader' animating={false} hidesWhenStopped />
        </InlineRow>
      </StorySection>

      <Span description>Useful for async save buttons and loading panels.</Span>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const smallLoader = canvas.getByRole('progressbar', { name: 'Small loader' })
    const primaryLoader = canvas.getByRole('progressbar', { name: 'Primary loader' })
    const pausedVisibleLoader = canvas.getByRole('progressbar', { name: 'Paused visible loader' })
    const pausedHiddenLoader = canvas.getByRole('progressbar', { name: 'Paused hidden loader' })

    await expect(smallLoader).toHaveAttribute('aria-valuemin', '0')
    await expect(primaryLoader).toHaveAttribute('aria-valuemax', '1')
    await expect(pausedVisibleLoader).toBeVisible()
    expect(
      pausedHiddenLoader.ownerDocument.defaultView?.getComputedStyle(pausedHiddenLoader.firstElementChild as Element).visibility
    ).toBe('hidden')
  }
}
