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
    await expect(canvas.getByRole('heading', { name: 'Large heading', exact: true })).toHaveAttribute('aria-level', '1')
    await expect(canvas.getByRole('heading', { name: 'Medium heading', exact: true })).toHaveAttribute('aria-level', '2')
    await expect(canvas.getByRole('heading', { name: 'Small heading', exact: true })).toHaveAttribute('aria-level', '4')
    await expect(canvas.getByText('Bold text', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Italic text', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Description text', { exact: true })).toBeVisible()
    expect(canvas.queryByRole('button', { name: 'Bold text', exact: true })).toBeNull()
  }
}
