import type { Meta, StoryObj } from '@storybook/react-native'
import { Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Typography/Span',
  component: Span
} satisfies Meta<typeof Span>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
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
  )
}
