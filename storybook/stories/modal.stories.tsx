import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, within } from 'storybook/test'
import { Button, Card, Div, Modal, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

function ModalStates () {
  const [windowVisible, setWindowVisible] = useState(false)
  const [fullscreenVisible, setFullscreenVisible] = useState(false)

  return (
    <StoryStack>
      <StorySection
        title='Window modal'
        description='The window layout uses the built-in header and action buttons. On web, dismiss through the button or backdrop.'
      >
        <InlineRow>
          <Button onPress={() => { setWindowVisible(true) }}>
            Open window modal
          </Button>
          <Modal
            visible={windowVisible}
            title='Review match results'
            cancelLabel='Later'
            confirmLabel='Publish'
            onRequestClose={() => { setWindowVisible(false) }}
            onCancel={() => { setWindowVisible(false) }}
            onConfirm={() => { setWindowVisible(false) }}
          >
            <Div gap={1}>
              <Span>
                This is the standard organizer flow: review the summary, then publish the result set.
              </Span>
              <Span description>
                The modal stays fully controlled from React state so closing behavior is easy to test.
              </Span>
            </Div>
          </Modal>
        </InlineRow>
      </StorySection>
      <StorySection
        title='Fullscreen modal composition'
        description='This example uses the subcomponents directly so the layout remains flexible.'
      >
        <InlineRow>
          <Button onPress={() => { setFullscreenVisible(true) }}>
            Open fullscreen modal
          </Button>
          <Modal
            variant='fullscreen'
            visible={fullscreenVisible}
            onRequestClose={() => { setFullscreenVisible(false) }}
          >
            <Modal.Header>Export event data</Modal.Header>
            <Modal.Content>
              <Card style={{ padding: 16 }}>
                <Div gap={0.5}>
                  <Span>Generate a snapshot for reporting or debugging.</Span>
                  <Span description>Close via the cross, the backdrop, or the custom action below.</Span>
                </Div>
              </Card>
            </Modal.Content>
            <Modal.Actions>
              <Button onPress={() => { setFullscreenVisible(false) }}>
                Close
              </Button>
            </Modal.Actions>
          </Modal>
        </InlineRow>
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Feedback/Modal',
  component: ModalStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof ModalStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => <ModalStates />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open window modal', exact: true }))

    const windowDialog = screen.getByRole('dialog', { name: 'Review match results', exact: true })
    await expect(windowDialog).toBeInTheDocument()
    const windowDialogQueries = within(windowDialog)
    await expect(windowDialogQueries.getByRole('button', { name: 'Later', exact: true })).toBeInTheDocument()
    await expect(windowDialogQueries.getByRole('button', { name: 'Publish', exact: true })).toBeInTheDocument()
    await expect(windowDialogQueries.getByRole('button', { name: 'Close dialog', exact: true })).toBeInTheDocument()

    await userEvent.click(windowDialogQueries.getByRole('button', { name: 'Close dialog', exact: true }))
    await expect(windowDialog).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Open fullscreen modal', exact: true }))

    const fullscreenDialog = screen.getByRole('dialog', { name: 'Export event data', exact: true })
    await expect(fullscreenDialog).toBeInTheDocument()
    const fullscreenDialogQueries = within(fullscreenDialog)
    await expect(fullscreenDialogQueries.getByRole('button', { name: 'Close dialog', exact: true })).toBeInTheDocument()
    await expect(fullscreenDialogQueries.getByRole('button', { name: 'Close', exact: true })).toBeInTheDocument()
  }
}
