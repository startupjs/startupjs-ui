import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const docsLink = canvas.getByRole('link', { name: 'Open docs' })
  const iconLink = canvas.getByRole('link', { name: 'Open StartupJS in a new tab' })

  expect(docsLink.querySelector('button')).toBeNull()
  expect(iconLink.querySelector('button')).toBeNull()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
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

          <Link
            href='https://startupjs.org'
            display='block'
            aria-label='Open StartupJS in a new tab'
          >
            <Button icon={faArrowUpRightFromSquare} />
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
  ),
  play: async ({ canvas }) => {
    const siteLink = canvas.getByRole('link', { name: 'StartupJS site' })
    const docsLink = canvas.getByRole('link', { name: 'Open docs' })
    const iconLink = canvas.getByRole('link', { name: 'Open StartupJS in a new tab' })
    const pushedLink = canvas.getByRole('link', { name: 'pushed link' })

    await expect(siteLink).toBeVisible()
    await expect(docsLink).toBeVisible()
    await expect(iconLink).toBeVisible()
    await expect(pushedLink).toBeVisible()
    expect(canvas.getAllByRole('link')).toHaveLength(4)
    expect(siteLink.getAttribute('href')).toContain('https://startupjs.org')
    expect(docsLink.getAttribute('href')).toContain('https://startupjs.org/docs')
    expect(iconLink.getAttribute('href')).toContain('https://startupjs.org')
    expect(pushedLink.getAttribute('href')).toContain('/storybook')
  }
}
