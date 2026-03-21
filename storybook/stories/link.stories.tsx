import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, Div, Link, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Navigation/Link',
  component: Link,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection
        title='Inline and block links'
        description='The link component can render inline text or wrap a full button block.'
      >
        <Div gap={1}>
          <Span>
            Visit the{' '}
            <Link href='https://startupjs.org' color='primary'>
              StartupJS site
            </Link>
            {' '}for the public docs.
          </Span>

          <Link href='https://startupjs.org/docs' display='block'>
            <Button>Open docs</Button>
          </Link>

          <Link to='/storybook' display='inline' push>
            pushed link
          </Link>
        </Div>
      </StorySection>

      <Div gap={0.5}>
        <Span description>These examples keep the component visible even if the router is not changing in Storybook.</Span>
      </Div>
    </StoryStack>
  )
}
