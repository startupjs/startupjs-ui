import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, Card, Drawer, Div, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const DRAWER_POSITIONS = ['left', 'right', 'top', 'bottom'] as const

function DrawerStates () {
  const [position, setPosition] = useState<(typeof DRAWER_POSITIONS)[number] | null>(null)

  return (
    <StoryStack>
      <StorySection
        title='Drawer positions'
        description='Open any edge drawer from the buttons below. On web, use the overlay or the close button to dismiss it.'
      >
        <InlineRow>
          {DRAWER_POSITIONS.map(drawerPosition => (
            <Button
              key={drawerPosition}
              onPress={() => { setPosition(drawerPosition) }}
            >
              {drawerPosition[0].toUpperCase() + drawerPosition.slice(1)}
            </Button>
          ))}
        </InlineRow>
      </StorySection>
      <Drawer
        visible={position != null}
        position={position ?? 'left'}
        style={position === 'top' || position === 'bottom' ? { height: 260 } : { width: 280 }}
        onDismiss={() => { setPosition(null) }}
      >
        <Card style={{ padding: 16, minHeight: 180 }}>
          <Div gap={1}>
            <Span h4>{position ? `${position[0].toUpperCase()}${position.slice(1)} drawer` : 'Drawer'}</Span>
            <Span description>
              This is a realistic action sheet style drawer with the default overlay and swipe responder.
            </Span>
            <Button onPress={() => { setPosition(null) }}>
              Close drawer
            </Button>
          </Div>
        </Card>
      </Drawer>
    </StoryStack>
  )
}

const meta = {
  title: 'Navigation/Drawer',
  component: DrawerStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof DrawerStates>

export default meta

type Story = StoryObj<typeof meta>

export const Positions: Story = {
  render: () => <DrawerStates />
}
