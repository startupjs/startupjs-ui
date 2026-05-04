import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Card, Div, Link, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Introduction/Overview',
  component: Div,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof Div>

export default meta

type Story = StoryObj<typeof meta>

export const Page: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='StartupJS UI Storybook'>
        <StoryStack>
          <Span>
            This Storybook is the main web QA surface for startupjs-ui. Use the sidebar to open
            component stories and inspect behavior, accessibility, and interaction coverage.
          </Span>
          <Span description>
            Web Storybook runs the shared stories with play-based assertions. Native Storybook is
            still available separately for iOS and Android browsing.
          </Span>
        </StoryStack>
      </StorySection>

      <StorySection title='Where To Start'>
        <StoryStack>
          <Card style={{ padding: 16 }}>
            <StoryStack>
              <Span bold>Recommended first checks</Span>
              <Span description>Open Button, Input, Select, Modal, and Tabs to validate core semantics.</Span>
              <Span description>Use the accessibility and interactions panels for extra debugging context.</Span>
            </StoryStack>
          </Card>

          <Div row gap={1} wrap>
            <Link to='/?path=/story/actions-button--states'>Open Button story</Link>
            <Link to='/?path=/story/inputs-textinput--states'>Open TextInput story</Link>
          </Div>
        </StoryStack>
      </StorySection>

      <StorySection title='Runtime Notes'>
        <StoryStack>
          <Span description>
            Web Storybook: `yarn storybook:web`
          </Span>
          <Span description>
            Native Storybook app: `yarn storybook:native`
          </Span>
          <Span description>
            Native Storybook on web shell: `yarn storybook:native:web`
          </Span>
        </StoryStack>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('StartupJS UI Storybook')).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Open Button story' })).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Open TextInput story' })).toBeVisible()
    await expect(canvas.getByText('Web Storybook: `yarn storybook:web`')).toBeVisible()
  }
}
