import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Layout, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof Layout>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <Layout>
      <StoryStack>
        <StorySection title='App shell'>
          <Div gap={0.5} style={{ padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
            <Span bold>Layout keeps content inside the safe area.</Span>
            <Span description>This is intentionally minimal because the component is a shell.</Span>
          </Div>
        </StorySection>
      </StoryStack>
    </Layout>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Layout keeps content inside the safe area.')).toBeVisible()
    await expect(canvas.getByText('This is intentionally minimal because the component is a shell.')).toBeVisible()
    expect(canvas.queryByRole('button')).toBeNull()
  }
}
