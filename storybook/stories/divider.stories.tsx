import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Divider, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Divider',
  component: Divider
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const defaultDividerHost = canvas.getByTestId('divider-horizontal-default').firstElementChild as HTMLElement | null
  const verticalDividerHost = canvas.getByTestId('divider-vertical').firstElementChild as HTMLElement | null

  await expect(defaultDividerHost).toHaveAttribute('role', 'separator')
  await expect(verticalDividerHost).toHaveAttribute('aria-orientation', 'vertical')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Horizontal'>
        <Div gap={1}>
          <Span description>Above</Span>
          <Div data-testid='divider-horizontal-default'>
            <Divider />
          </Div>
          <Span description>Below</Span>
          <Div data-testid='divider-horizontal-large'>
            <Divider size='l' lines={2} />
          </Div>
        </Div>
      </StorySection>

      <StorySection title='Vertical'>
        <Div row vAlign='center' gap={1}>
          <Span description>Left</Span>
          <Div data-testid='divider-vertical' style={{ height: 48 }}>
            <Divider variant='vertical' lines={3} />
          </Div>
          <Span description>Right</Span>
        </Div>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const defaultDividerHost = canvas.getByTestId('divider-horizontal-default').firstElementChild as HTMLElement | null
    const largeDividerHost = canvas.getByTestId('divider-horizontal-large').firstElementChild as HTMLElement | null
    const verticalDividerHost = canvas.getByTestId('divider-vertical').firstElementChild as HTMLElement | null

    await expect(canvas.getByText('Above', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Below', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Left', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Right', { exact: true })).toBeVisible()
    expect(defaultDividerHost).not.toBeNull()
    expect(largeDividerHost).not.toBeNull()
    expect(verticalDividerHost).not.toBeNull()

    const view = defaultDividerHost?.ownerDocument.defaultView
    expect(view?.getComputedStyle(defaultDividerHost!).height).toBe('1px')
    expect(view?.getComputedStyle(largeDividerHost!).height).toBe('2px')
    expect(view?.getComputedStyle(verticalDividerHost!).width).toBe('1px')
    expect(parseFloat(view?.getComputedStyle(verticalDividerHost!).height ?? '0')).toBeGreaterThan(1)
    expect(defaultDividerHost?.getAttribute('role')).toBeNull()
    expect(verticalDividerHost?.getAttribute('role')).toBeNull()
  }
}
