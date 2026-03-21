import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, Card, Div, Portal, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function PortalStates () {
  const [open, setOpen] = useState(false)

  return (
    <StoryStack>
      <StorySection
        title='Portal host'
        description='The content below is rendered outside the local subtree. Storybook already mounts the shared Portal.Provider in preview.'
      >
        <Div gap={1.5}>
          <Button onPress={() => { setOpen(v => !v) }}>
            Toggle portal card
          </Button>
          <Card style={{ padding: 16 }}>
            <Div gap={0.5}>
              <Span bold>Inline source tree</Span>
              <Span description>
                The portal destination should appear independently of this source card.
              </Span>
            </Div>
          </Card>
          {open && (
            <Portal>
              <Card style={{ padding: 16, backgroundColor: 'var(--color-bg-main-subtle-alt)' }}>
                <Div gap={0.5}>
                  <Span bold>Portal destination</Span>
                  <Span description>
                    This card is mounted through the shared portal host rather than the local tree.
                  </Span>
                </Div>
              </Card>
            </Portal>
          )}
        </Div>
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Overlay/Portal',
  component: PortalStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof PortalStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <PortalStates />
}
