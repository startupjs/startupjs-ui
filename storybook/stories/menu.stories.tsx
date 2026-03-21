import type { Meta, StoryObj } from '@storybook/react-native'
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

export const States: Story = {
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
  )
}
