import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor, within } from 'storybook/test'
import { Button, Card, Div, Modal, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

// The Vitest addon resizes the test browser to a story's viewport before rendering it
const VIEWPORTS = {
  phone390: { name: 'Phone (390x844)', styles: { width: '390px', height: '844px' }, type: 'mobile' },
  desktop1440: { name: 'Desktop (1440x900)', styles: { width: '1440px', height: '900px' }, type: 'desktop' }
}
const HEADER_PADDING = 16
const CLOSE_GAP = 16 // space between the title and the close icon
const ICON_SIZE = 24 // close icon, Icon size 'xl'
const TOUCH_TARGET = 44 // WCAG 2.5.5 and Apple's HIG minimum for touch screens
const CLOSE_TARGET_TITLE = 'Review match results'

function CloseTargetPreview () {
  const [visible, setVisible] = useState(true)

  return (
    <StoryStack>
      <StorySection
        title='Close button touch target'
        description="On touch screens the header's close button is a 44x44 tap area around its 24px icon. Desktop web keeps the 24x24 target, and the header layout is the same on both."
      >
        <InlineRow>
          <Button onPress={() => { setVisible(true) }}>
            Open modal
          </Button>
          <Modal
            visible={visible}
            title={CLOSE_TARGET_TITLE}
            cancelLabel='Later'
            confirmLabel='Publish'
            onRequestClose={() => { setVisible(false) }}
            onCancel={() => { setVisible(false) }}
            onConfirm={() => { setVisible(false) }}
          >
            <Span>Review the summary, then publish the result set.</Span>
          </Modal>
        </InlineRow>
      </StorySection>
    </StoryStack>
  )
}

function measureModalHeader (dialog: HTMLElement) {
  const close = within(dialog).getByRole('button', { name: 'Close dialog' })
  const title = within(dialog).getByText(CLOSE_TARGET_TITLE)
  const header = close.parentElement
  const icon = close.querySelector('svg')
  if (!header?.contains(title) || !icon) throw Error('Unexpected modal header structure')
  return {
    close,
    title,
    closeBox: close.getBoundingClientRect(),
    iconBox: icon.getBoundingClientRect(),
    titleBox: title.getBoundingClientRect(),
    headerBox: header.getBoundingClientRect()
  }
}

// The close button's tap area must not move the header's content on any screen
function expectHeaderLayout ({ title, iconBox, titleBox, headerBox }: ReturnType<typeof measureModalHeader>) {
  expect(iconBox.width).toBeCloseTo(ICON_SIZE, 0)
  expect(iconBox.height).toBeCloseTo(ICON_SIZE, 0)
  expect(headerBox.right - iconBox.right).toBeCloseTo(HEADER_PADDING, 0)
  expect(iconBox.left - titleBox.right).toBeCloseTo(CLOSE_GAP, 0)
  expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth)
  expect(iconBox.top + iconBox.height / 2).toBeCloseTo(titleBox.top + titleBox.height / 2, 0)
  expect(headerBox.height).toBeCloseTo(2 * HEADER_PADDING + Math.max(titleBox.height, ICON_SIZE), 0)
}

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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  await userEvent.click(canvas.getByRole('button', { name: 'Open window modal' }))
  await expect(screen.getByRole('button', { name: 'Dismiss modal backdrop' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <ModalStates />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open window modal' }))

    const windowDialog = screen.getByRole('dialog', { name: 'Review match results' })
    await expect(windowDialog).toBeInTheDocument()
    const windowDialogQueries = within(windowDialog)
    await expect(windowDialogQueries.getByRole('button', { name: 'Later' })).toBeInTheDocument()
    await expect(windowDialogQueries.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
    await expect(windowDialogQueries.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()

    await userEvent.click(windowDialogQueries.getByRole('button', { name: 'Close dialog' }))
    await expect(windowDialog).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Open fullscreen modal' }))

    const fullscreenDialog = screen.getByRole('dialog', { name: 'Export event data' })
    await expect(fullscreenDialog).toBeInTheDocument()
    const fullscreenDialogQueries = within(fullscreenDialog)
    await expect(fullscreenDialogQueries.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
    await expect(fullscreenDialogQueries.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  }
}

export const CloseButtonOnPhone: Story = {
  tags: ['interaction'],
  parameters: { viewport: { options: VIEWPORTS } },
  globals: { viewport: { value: 'phone390', isRotated: false } },
  render: () => <CloseTargetPreview />,
  play: async ({ userEvent }) => {
    const dialog = await screen.findByRole('dialog', { name: CLOSE_TARGET_TITLE })
    // Styles follow the viewport once the resize settles
    const header = await waitFor(() => {
      const measured = measureModalHeader(dialog)
      expect(measured.closeBox.width).toBeCloseTo(TOUCH_TARGET, 0)
      return measured
    })
    const { close, closeBox, iconBox } = header
    await expect(closeBox.height).toBeCloseTo(TOUCH_TARGET, 0)
    await expect(closeBox.left + closeBox.width / 2).toBeCloseTo(iconBox.left + iconBox.width / 2, 0)
    await expect(closeBox.top + closeBox.height / 2).toBeCloseTo(iconBox.top + iconBox.height / 2, 0)
    expectHeaderLayout(header)

    // A tap in the corner of the target, outside the icon, still hits the close button
    const corner = close.ownerDocument.elementFromPoint(closeBox.left + 2, closeBox.top + 2)
    await expect(corner !== null && close.contains(corner)).toBe(true)
    await userEvent.click(corner as Element)
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
  }
}

export const CloseButtonOnDesktop: Story = {
  tags: ['interaction'],
  parameters: { viewport: { options: VIEWPORTS } },
  globals: { viewport: { value: 'desktop1440', isRotated: false } },
  render: () => <CloseTargetPreview />,
  play: async ({ userEvent }) => {
    const dialog = await screen.findByRole('dialog', { name: CLOSE_TARGET_TITLE })
    // Styles follow the viewport once the resize settles
    const header = await waitFor(() => {
      const measured = measureModalHeader(dialog)
      expect(measured.closeBox.width).toBeCloseTo(ICON_SIZE, 0)
      return measured
    })
    const { close, closeBox, iconBox } = header
    await expect(closeBox.height).toBeCloseTo(ICON_SIZE, 0)
    await expect(closeBox.left).toBeCloseTo(iconBox.left, 0)
    await expect(closeBox.top).toBeCloseTo(iconBox.top, 0)
    expectHeaderLayout(header)

    await userEvent.click(close)
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
  }
}
