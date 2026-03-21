import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $, observer } from 'startupjs'
import { Button, Card, Div, Sidebar, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const SidebarStates = observer(function SidebarStates () {
  const [$open] = useState(() => $(true))

  return (
    <StoryStack>
      <StorySection
        title='Fixed sidebar'
        description='The sidebar keeps the main surface visible while the navigation column stays in view.'
      >
        <Div gap={2} style={{ minHeight: 360 }}>
          <Div row gap={1}>
            <Button onPress={() => { $open.set(true) }}>
              Open
            </Button>
            <Button onPress={() => { $open.set(false) }}>
              Close
            </Button>
          </Div>
          <Sidebar
            $open={$open}
            width={260}
            renderContent={() => (
              <Div gap={1.5} style={{ padding: 16 }}>
                <Span h4>Event navigation</Span>
                <Card style={{ padding: 12 }}>
                  <Span bold>Dashboard</Span>
                </Card>
                <Card style={{ padding: 12 }}>
                  <Span bold>Men</Span>
                </Card>
                <Card style={{ padding: 12 }}>
                  <Span bold>Women</Span>
                </Card>
              </Div>
            )}
          >
            <Card style={{ padding: 20 }}>
              <Div gap={0.75}>
                <Span h4>Main content</Span>
                <Span description>
                  This pane stays available while the sidebar is open. The story starts open so the layout is easy to inspect.
                </Span>
              </Div>
            </Card>
          </Sidebar>
        </Div>
      </StorySection>
    </StoryStack>
  )
})

const meta = {
  title: 'Navigation/Sidebar',
  component: SidebarStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof SidebarStates>

export default meta

type Story = StoryObj<typeof meta>

export const FixedLayout: Story = {
  render: () => <SidebarStates />
}
