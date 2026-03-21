import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $, observer } from 'startupjs'
import { Button, Card, Div, SmartSidebar, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function SmartSidebarDemo ({
  title,
  breakpoint,
  defaultOpen
}: {
  title: string
  breakpoint: number
  defaultOpen: boolean
}) {
  const [$open] = useState(() => $(false))

  return (
    <StorySection
      title={title}
      description='One example uses the fixed sidebar branch and the other forces the drawer branch so both paths are visible in web Storybook.'
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
        <SmartSidebar
          $open={$open}
          fixedLayoutBreakpoint={breakpoint}
          defaultOpen={defaultOpen}
          width={260}
          renderContent={() => (
            <Div gap={1.5} style={{ padding: 16 }}>
              <Span h4>Navigation</Span>
              <Card style={{ padding: 12 }}>
                <Span bold>Dashboard</Span>
              </Card>
              <Card style={{ padding: 12 }}>
                <Span bold>Participants</Span>
              </Card>
            </Div>
          )}
        >
          <Card style={{ padding: 20 }}>
            <Div gap={0.75}>
              <Span h4>Workspace</Span>
              <Span description>
                The active branch is determined by `fixedLayoutBreakpoint` and the current viewport width.
              </Span>
            </Div>
          </Card>
        </SmartSidebar>
      </Div>
    </StorySection>
  )
}

const SmartSidebarStates = observer(function SmartSidebarStates () {
  return (
    <StoryStack>
      <SmartSidebarDemo title='Fixed layout branch' breakpoint={1} defaultOpen />
      <SmartSidebarDemo title='Drawer branch' breakpoint={99999} defaultOpen={false} />
    </StoryStack>
  )
})

const meta = {
  title: 'Navigation/SmartSidebar',
  component: SmartSidebarStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof SmartSidebarStates>

export default meta

type Story = StoryObj<typeof meta>

export const Branches: Story = {
  render: () => <SmartSidebarStates />
}
