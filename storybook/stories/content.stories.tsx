import type { Meta, StoryObj } from '@storybook/react-native'
import { Content, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Content',
  component: Content
} satisfies Meta<typeof Content>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Width presets'>
        <StoryStack>
          <Content padding width='mobile' style={{ borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Mobile width</Span>
          </Content>
          <Content padding width='tablet' style={{ borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Tablet width</Span>
          </Content>
          <Content padding width='desktop' pure style={{ borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Desktop width, pure</Span>
          </Content>
        </StoryStack>
      </StorySection>

      <StorySection title='Full height content'>
        <Div style={{ height: 220, borderRadius: 12, backgroundColor: '#f9fafb', overflow: 'hidden' }}>
          <Content full padding={3}>
            <Div gap={0.5}>
              <Span bold>Nested content keeps the horizontal rhythm.</Span>
              <Span description>Use this for page-level sections and documents.</Span>
            </Div>
          </Content>
        </Div>
      </StorySection>
    </StoryStack>
  )
}
