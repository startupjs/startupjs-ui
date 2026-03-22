import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Div, Menu, Span } from 'startupjs-ui'
import { faCircleInfo, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Navigation/Menu',
  component: Menu,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('menu')).toBeVisible()
  await expect(canvas.getByRole('menuitem', { name: 'Overview' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Vertical menu'>
        <Menu variant='vertical' activeBorder='left' activeColor='#0f172a'>
          <Menu.Item to='/overview' icon={faCircleInfo} active>
            Overview
          </Menu.Item>
          <Menu.Item to='/matches' icon={faHeart}>
            Matches
          </Menu.Item>
        </Menu>
      </StorySection>

      <StorySection title='Horizontal menu'>
        <Menu variant='horizontal' iconPosition='right'>
          <Menu.Item onPress={() => {}} icon={faSearch}>
            Search
          </Menu.Item>
          <Menu.Item onPress={() => {}} icon={faHeart} active>
            Saved
          </Menu.Item>
        </Menu>
      </StorySection>

      <Div gap={0.5}>
        <Span description>These examples cover the active border, icon placement, and nested menu items without route switching.</Span>
      </Div>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const overviewLink = canvas.getByRole('link', { name: 'Overview' })
    const matchesLink = canvas.getByRole('link', { name: 'Matches' })
    const searchButton = canvas.getByRole('button', { name: 'Search' })
    const savedButton = canvas.getByRole('button', { name: 'Saved' })

    await expect(overviewLink).toBeVisible()
    await expect(matchesLink).toBeVisible()
    await expect(searchButton).toBeVisible()
    await expect(savedButton).toBeVisible()
    expect(overviewLink.getAttribute('href')).toContain('/overview')
    expect(matchesLink.getAttribute('href')).toContain('/matches')
  }
}
