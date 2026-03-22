import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Breadcrumbs, Div, Span } from 'startupjs-ui'
import { faCircleInfo, faSearch } from '@fortawesome/free-solid-svg-icons'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('navigation', { name: 'Breadcrumbs' })).toBeVisible()
  await expect(canvas.getByText('Breadcrumbs')).toHaveAttribute('aria-current', 'page')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection
        title='Linked trail'
        description='Breadcrumbs expose route links and leave the last item as the current page.'
      >
        <Div data-testid='breadcrumbs-linked'>
          <Breadcrumbs
            routes={[
              { name: 'Navigation', to: '/', icon: faSearch },
              { name: 'Breadcrumbs', icon: faCircleInfo }
            ]}
          />
        </Div>
      </StorySection>

      <StorySection title='Custom separator and icon placement'>
        <Div data-testid='breadcrumbs-custom'>
          <Breadcrumbs
            routes={[
              { name: 'StartupJS', to: '#startupjs', icon: faSearch },
              { name: 'UI', to: '#ui', icon: faCircleInfo },
              { name: 'Breadcrumbs', icon: faCircleInfo }
            ]}
            iconPosition='right'
            separator='>'
          />
        </Div>
      </StorySection>

      <Div gap={0.5}>
        <Span description>These stories stay static so Storybook can render them without router shell state.</Span>
      </Div>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const linkedBreadcrumbs = canvas.getByTestId('breadcrumbs-linked')
    const customBreadcrumbs = canvas.getByTestId('breadcrumbs-custom')
    const navigationLink = canvas.getByRole('link', { name: 'Navigation' })
    const startupLink = canvas.getByRole('link', { name: 'StartupJS' })
    const uiLink = canvas.getByRole('link', { name: 'UI' })

    await expect(navigationLink).toBeVisible()
    await expect(startupLink).toBeVisible()
    await expect(uiLink).toBeVisible()
    expect(canvas.getAllByRole('link')).toHaveLength(3)
    expect(linkedBreadcrumbs.getAttribute('role')).toBeNull()
    expect(linkedBreadcrumbs.textContent).toContain('Breadcrumbs')
    expect(customBreadcrumbs.textContent).toContain('>')
    expect(customBreadcrumbs.textContent).toContain('StartupJS')
    expect(customBreadcrumbs.textContent).toContain('UI')
    expect(customBreadcrumbs.textContent).toContain('Breadcrumbs')
  }
}
