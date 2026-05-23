import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Content, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Content',
  component: Content
} satisfies Meta<typeof Content>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Width presets'>
        <StoryStack>
          <Content testID='content-mobile' padding width='mobile' style={{ borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Mobile width</Span>
          </Content>
          <Content testID='content-tablet' padding width='tablet' style={{ borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Tablet width</Span>
          </Content>
          <Content testID='content-desktop-pure' padding width='desktop' pure style={{ borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Desktop width, pure</Span>
          </Content>
        </StoryStack>
      </StorySection>

      <StorySection title='Full height content'>
        <Div style={{ height: 220, borderRadius: 12, backgroundColor: '#f9fafb', overflow: 'hidden' }}>
          <Content testID='content-full' full padding={3}>
            <Div gap={0.5}>
              <Span bold>Nested content keeps the horizontal rhythm.</Span>
              <Span description>Use this for page-level sections and documents.</Span>
            </Div>
          </Content>
        </Div>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const mobileContent = canvas.getByTestId('content-mobile')
    const tabletContent = canvas.getByTestId('content-tablet')
    const desktopPureContent = canvas.getByTestId('content-desktop-pure')
    const fullContent = canvas.getByTestId('content-full')

    await expect(canvas.getByText('Mobile width', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Tablet width', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Desktop width, pure', { exact: true })).toBeVisible()
    expect(mobileContent.getAttribute('role')).toBeNull()
    expect(tabletContent.ownerDocument.defaultView?.getComputedStyle(tabletContent).maxWidth).not.toBe('none')
    expect(desktopPureContent.ownerDocument.defaultView?.getComputedStyle(desktopPureContent).paddingLeft).toBe('0px')
    expect(fullContent.ownerDocument.defaultView?.getComputedStyle(fullContent).flexGrow).toBe('1')
  }
}
