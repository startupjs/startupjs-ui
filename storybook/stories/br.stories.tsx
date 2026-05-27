import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Br, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Br',
  component: Br
} satisfies Meta<typeof Br>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const spacer = canvas.getByTestId('br-default')

  await expect(spacer).toHaveAttribute('aria-hidden', 'true')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Standard spacing'>
        <Div style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
          <Span bold>Top line</Span>
          <Br testID='br-default' />
          <Span description>Bottom line</Span>
        </Div>
      </StorySection>

      <StorySection title='Half and multi-line spacing'>
        <Div gap={0.5} style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
          <Span bold>Half step</Span>
          <Br testID='br-half' half />
          <Span description>Next line</Span>
          <Br testID='br-double' lines={2} />
          <Span description>Two-line gap</Span>
        </Div>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const defaultSpacer = canvas.getByTestId('br-default')
    const halfSpacer = canvas.getByTestId('br-half')
    const doubleSpacer = canvas.getByTestId('br-double')

    await expect(canvas.getByText('Top line', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Bottom line', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Half step', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Two-line gap', { exact: true })).toBeVisible()
    expect(defaultSpacer).not.toBeNull()
    expect(halfSpacer).not.toBeNull()
    expect(doubleSpacer).not.toBeNull()

    const view = defaultSpacer?.ownerDocument.defaultView
    expect(view?.getComputedStyle(defaultSpacer!).height).toBe('16px')
    expect(view?.getComputedStyle(halfSpacer!).height).toBe('8px')
    expect(view?.getComputedStyle(doubleSpacer!).height).toBe('32px')
    expect(view?.getComputedStyle(doubleSpacer!).flexShrink).toBe('0')
    expect(defaultSpacer?.textContent).toBe('')
    expect(defaultSpacer?.getAttribute('role')).toBeNull()
  }
}
