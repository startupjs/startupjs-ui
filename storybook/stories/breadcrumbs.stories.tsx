import type { Meta, StoryObj } from '@storybook/react-native'
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

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection
        title='Linked trail'
        description='Breadcrumbs expose route links and leave the last item as the current page.'
      >
        <Breadcrumbs
          routes={[
            { name: 'Navigation', to: '/', icon: faSearch },
            { name: 'Breadcrumbs', icon: faCircleInfo }
          ]}
        />
      </StorySection>

      <StorySection title='Custom separator and icon placement'>
        <Breadcrumbs
          routes={[
            { name: 'StartupJS', to: '#startupjs', icon: faSearch },
            { name: 'UI', to: '#ui', icon: faCircleInfo },
            { name: 'Breadcrumbs', icon: faCircleInfo }
          ]}
          iconPosition='right'
          separator='>'
        />
      </StorySection>

      <Div gap={0.5}>
        <Span description>These stories stay static so Storybook can render them without router shell state.</Span>
      </Div>
    </StoryStack>
  )
}
