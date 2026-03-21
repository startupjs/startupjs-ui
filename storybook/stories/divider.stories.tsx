import type { Meta, StoryObj } from '@storybook/react-native'
import { Divider, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Divider',
  component: Divider
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Horizontal'>
        <Div gap={1}>
          <Span description>Above</Span>
          <Divider />
          <Span description>Below</Span>
          <Divider size='l' lines={2} />
        </Div>
      </StorySection>

      <StorySection title='Vertical'>
        <Div row vAlign='center' gap={1}>
          <Span description>Left</Span>
          <Divider variant='vertical' lines={3} />
          <Span description>Right</Span>
        </Div>
      </StorySection>
    </StoryStack>
  )
}
