import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Typography/Span',
  component: Span
} satisfies Meta<typeof Span>

export default meta

type Story = StoryObj<typeof meta>

function getStyle (element: Element): CSSStyleDeclaration {
  const view = element.ownerDocument.defaultView
  if (!view) throw Error('Expected element to have a window')
  return view.getComputedStyle(element)
}

function expectPx (value: string, expected: number) {
  expect(Math.round(parseFloat(value))).toBe(expected)
}

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Headings'>
        <Span h1>Large heading</Span>
        <Span h2>Medium heading</Span>
        <Span h4>Small heading</Span>
      </StorySection>

      <StorySection title='Text styles'>
        <Span bold>Bold text</Span>
        <Span italic>Italic text</Span>
        <Span description>Description text</Span>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const largeHeading = canvas.getByRole('heading', { name: 'Large heading' })
    const mediumHeading = canvas.getByRole('heading', { name: 'Medium heading' })
    const smallHeading = canvas.getByRole('heading', { name: 'Small heading' })

    await expect(largeHeading).toHaveAttribute('aria-level', '1')
    await expect(mediumHeading).toHaveAttribute('aria-level', '2')
    await expect(smallHeading).toHaveAttribute('aria-level', '4')
    await expect(canvas.getByText('Bold text', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Italic text', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Description text', { exact: true })).toBeVisible()
    expect(canvas.queryByRole('button', { name: 'Bold text' })).toBeNull()

    expectPx(getStyle(largeHeading).lineHeight, 96)
    expectPx(getStyle(mediumHeading).lineHeight, 64)
    expectPx(getStyle(smallHeading).lineHeight, 32)
  }
}
