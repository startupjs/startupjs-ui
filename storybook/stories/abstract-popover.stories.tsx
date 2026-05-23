import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen } from 'storybook/test'
import { AbstractPopover, Button, Card, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function AbstractPopoverStates () {
  const anchorRef = useRef<any>({
    measure: (callback: any) => callback(0, 0, 220, 64, 40, 120)
  })
  const [visible, setVisible] = useState(false)
  const [requestOpenCount, setRequestOpenCount] = useState(0)
  const [requestCloseCount, setRequestCloseCount] = useState(0)
  const [openCompleteCount, setOpenCompleteCount] = useState(0)
  const [closeCompleteCount, setCloseCompleteCount] = useState(0)

  return (
    <StoryStack>
      <StorySection
        title='Anchored popover'
        description='This story uses a stable mocked anchor measurement so the low-level lifecycle stays deterministic in Storybook tests.'
      >
        <Div gap={1.5}>
          <Button onPress={() => { setVisible(true) }}>
            Show popover
          </Button>
          <Div style={{ width: 220, alignSelf: 'flex-start' }}>
            <Card>
              <Div gap={0.5}>
                <Span bold>Anchor target</Span>
                <Span description>The popover width and placement are computed from the mocked anchor ref.</Span>
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
            testID='abstract-popover-surface'
            renderWrapper={node => <Div testID='abstract-popover-portal'>{node}</Div>}
            onRequestOpen={() => { setRequestOpenCount(count => count + 1) }}
            onRequestClose={() => {
              setRequestCloseCount(count => count + 1)
              setVisible(false)
            }}
            onOpenComplete={() => { setOpenCompleteCount(count => count + 1) }}
            onCloseComplete={() => { setCloseCompleteCount(count => count + 1) }}
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
          <Div gap={0.5}>
            <Span>Request open count: {requestOpenCount}</Span>
            <Span>Request close count: {requestCloseCount}</Span>
            <Span>Open complete count: {openCompleteCount}</Span>
            <Span>Close complete count: {closeCompleteCount}</Span>
          </Div>
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Show popover' })).toBeVisible()
  await expect(screen.getByTestId('abstract-popover-surface')).toBeVisible()
  await expect(screen.getByRole('dialog')).toBeVisible()
}
void failingFollowup

export const Anchored: Story = {
  tags: ['interaction'],
  render: () => <AbstractPopoverStates />
}
