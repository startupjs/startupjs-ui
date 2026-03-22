import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor } from 'storybook/test'
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
      <Div gap={0.5}>
        <Span>Open drawer: {position ?? 'none'}</Span>
      </Div>
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  await userEvent.click(canvas.getByRole('button', { name: 'Left' }))
  await waitFor(() => expect(screen.getByRole('dialog', { name: 'Left drawer' })).toBeVisible())
}
void failingFollowup

export const Positions: Story = {
  tags: ['interaction'],
  render: () => <DrawerStates />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Open drawer: none')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Left' }))
    await waitFor(() => expect(screen.getByText('Left drawer')).toBeVisible())
    await waitFor(() => expect(canvas.getByText('Open drawer: left')).toBeVisible())
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }))
    await waitFor(() => expect(canvas.getByText('Open drawer: none')).toBeVisible())

    await userEvent.click(canvas.getByRole('button', { name: 'Bottom' }))
    await waitFor(() => expect(screen.getByText('Bottom drawer')).toBeVisible())
    await waitFor(() => expect(canvas.getByText('Open drawer: bottom')).toBeVisible())
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }))
    await waitFor(() => expect(canvas.getByText('Open drawer: none')).toBeVisible())
  }
}
