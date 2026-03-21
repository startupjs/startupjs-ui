import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { AbstractPopover, Button, Card, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function AbstractPopoverStates () {
  const anchorRef = useRef<any>(null)
  const [visible, setVisible] = useState(false)

  return (
    <StoryStack>
      <StorySection
        title='Anchored popover'
        description='The popover is positioned from an explicit anchor ref. On web, the exact placement can shift slightly with viewport size.'
      >
        <Div gap={1.5}>
          <Button onPress={() => { setVisible(true) }}>
            Show popover
          </Button>
          <Div
            ref={anchorRef}
            style={{ width: 220, alignSelf: 'flex-start' }}
          >
            <Card>
              <Div gap={0.5}>
                <Span bold>Anchor target</Span>
                <Span description>Popover is measured against this card.</Span>
              </Div>
            </Card>
          </Div>
          <AbstractPopover
            visible={visible}
            anchorRef={anchorRef}
            position='bottom'
            attachment='start'
            arrow
            matchAnchorWidth
            onRequestClose={() => { setVisible(false) }}
          >
            <Card style={{ padding: 16, minWidth: 240 }}>
              <Div gap={1}>
                <Div gap={0.5}>
                  <Span bold>Popover content</Span>
                  <Span description>Use this pattern for low-level anchored surfaces.</Span>
                </Div>
                <Button onPress={() => { setVisible(false) }}>
                  Close
                </Button>
              </Div>
            </Card>
          </AbstractPopover>
        </Div>
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Overlay/AbstractPopover',
  component: AbstractPopoverStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof AbstractPopoverStates>

export default meta

type Story = StoryObj<typeof meta>

export const Anchored: Story = {
  render: () => <AbstractPopoverStates />
}
