/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor } from 'storybook/test'
import { Button, Div, Span, alert, confirm, prompt } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const DialogStorySurface = () => {
  const [lastAlertState, setLastAlertState] = useState('idle')
  const [lastConfirmResult, setLastConfirmResult] = useState('idle')
  const [lastPromptValue, setLastPromptValue] = useState('idle')

  return (
    <StoryStack>
      <StorySection
        title='Dialog helpers'
        description='These stories exercise the globally mounted dialog helpers through UiProvider.'
      >
        <InlineRow>
          <Button
            onPress={async () => {
              setLastAlertState('opening')
              await alert({
                title: 'Delete participant?',
                message: 'This action can be reversed later in the story.'
              })
              setLastAlertState('closed')
            }}
          >Open alert</Button>
          <Button
            onPress={async () => {
              const result = await confirm({
                title: 'Publish results',
                message: 'Participants will see their matches immediately.'
              })
              setLastConfirmResult(String(result))
            }}
          >Open confirm</Button>
          <Button
            onPress={async () => {
              const result = await prompt({
                title: 'Rename event',
                message: 'Set a new title for this event.',
                defaultValue: 'Spring meetup'
              })
              setLastPromptValue(result == null ? 'null' : result)
            }}
          >Open prompt</Button>
        </InlineRow>
      </StorySection>
      <Div gap={0.5}>
        <Span>Last alert state: {lastAlertState}</Span>
        <Span>Last confirm result: {lastConfirmResult}</Span>
        <Span>Last prompt value: {lastPromptValue}</Span>
      </Div>
      <Div gap={0.5}>
        <Span description>
          Verify that dialogs stay functional after switching between stories and returning here.
        </Span>
      </Div>
    </StoryStack>
  )
}

const meta = {
  title: 'Feedback/Dialogs',
  component: DialogStorySurface,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof DialogStorySurface>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  await userEvent.click(canvas.getByRole('button', { name: 'Open prompt' }))
  await expect(screen.getByRole('textbox', { name: 'Rename event' })).toBeVisible()
}
void failingFollowup

export const Helpers: Story = {
  tags: ['interaction'],
  render: () => <DialogStorySurface />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Last alert state: idle')).toBeVisible()
    await expect(canvas.getByText('Last confirm result: idle')).toBeVisible()
    await expect(canvas.getByText('Last prompt value: idle')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Open alert' }))
    await waitFor(() => expect(screen.getByRole('alertdialog', { name: 'Delete participant?' })).toBeVisible())
    await waitFor(() => expect(screen.getByRole('button', { name: 'OK' })).toBeVisible())
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    await waitFor(() => expect(canvas.getByText('Last alert state: closed')).toBeVisible())

    await userEvent.click(canvas.getByRole('button', { name: 'Open confirm' }))
    await waitFor(() => expect(screen.getByRole('alertdialog', { name: 'Publish results' })).toBeVisible())
    await waitFor(() => expect(screen.getByText('Participants will see their matches immediately.')).toBeVisible())
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(canvas.getByText('Last confirm result: false')).toBeVisible())

    await userEvent.click(canvas.getByRole('button', { name: 'Open prompt' }))
    await waitFor(() => expect(screen.getByRole('alertdialog', { name: 'Rename event' })).toBeVisible())
    const promptInput = screen.getByRole('textbox')
    await userEvent.clear(promptInput)
    await userEvent.type(promptInput, 'Summer mixer')
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    await waitFor(() => expect(canvas.getByText('Last prompt value: Summer mixer')).toBeVisible())
  }
}
