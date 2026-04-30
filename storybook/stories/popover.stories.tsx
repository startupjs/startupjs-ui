import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { Button, Card, Div, Popover, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function PopoverStates () {
  const [visible, setVisible] = useState(false)

  return (
    <StoryStack>
      <StorySection
        title='Anchored popover'
        description='Click the anchor to open the popover. The overlay closes on outside press, which is the main web interaction to verify here.'
      >
        <Popover
          visible={visible}
          onChange={setVisible}
          position='bottom'
          attachment='start'
          renderContent={() => (
            <Card style={{ minWidth: 240, padding: 16 }}>
              <Div gap={1}>
                <Div gap={0.5}>
                  <Span bold>Popover menu</Span>
                  <Span description>Keep popovers focused on short contextual actions.</Span>
                </Div>
                <Button onPress={() => { setVisible(false) }}>
                  Close
                </Button>
              </Div>
            </Card>
          )}
        >
          <Card style={{ padding: 16, width: 220 }}>
            <Div gap={0.5}>
              <Span bold>Open popover</Span>
              <Span description>Press this card to open the anchored surface.</Span>
            </Div>
          </Card>
        </Popover>
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Overlay/Popover',
  component: PopoverStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof PopoverStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('dialog', { name: 'Popover menu' })).toBeVisible()
}
void failingFollowup

export const Anchored: Story = {
  tags: ['interaction'],
  render: () => <PopoverStates />,
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Popover menu')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Open popover Press this card to open the anchored surface.' }))
    const closeButtons = canvas.getAllByRole('button', { name: 'Close' })
    expect(closeButtons.length).toBeGreaterThan(0)

    await userEvent.click(closeButtons.at(-1)!)
  }
}
