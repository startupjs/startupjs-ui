import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Button, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Div',
  component: Div
} satisfies Meta<typeof Div>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const disabledTrigger = canvas.getByRole('button', { name: 'Disabled trigger' })
  await expect(disabledTrigger).toHaveAttribute('aria-disabled', 'true')
}
void failingFollowup

function DivStates () {
  const [activationCount, setActivationCount] = useState(0)
  const [simpleActivationCount, setSimpleActivationCount] = useState(0)
  const [disabledActivationCount, setDisabledActivationCount] = useState(0)

  return (
    <StoryStack>
      <StorySection title='Layout primitives'>
        <Div row align='center' vAlign='center' gap={1} style={{ justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
          <Span bold>Row container</Span>
          <Button size='s'>Action</Button>
        </Div>
      </StorySection>

      <StorySection title='Pressable container'>
        <Div
          row
          align='center'
          vAlign='center'
          gap={1}
          aria-label='Open sheet'
          style={{ justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: '#eef2ff' }}
          onPress={() => setActivationCount(count => count + 1)}
        >
          <Div gap={0.25}>
            <Span bold>Open sheet</Span>
            <Span description>Div can act as a lightweight interactive surface.</Span>
          </Div>
          <Span description>Tap target</Span>
        </Div>
        <Span aria-live='polite'>Activations: {activationCount}</Span>
      </StorySection>

      <StorySection title='Visible text naming and disabled state'>
        <Div gap={1}>
          <Div
            onPress={() => setSimpleActivationCount(count => count + 1)}
            style={{ padding: 16, borderRadius: 12, backgroundColor: '#fef3c7' }}
          >
            <Span>Simple trigger</Span>
          </Div>
          <Div
            disabled
            onPress={() => setDisabledActivationCount(count => count + 1)}
            style={{ padding: 16, borderRadius: 12, backgroundColor: '#e5e7eb' }}
          >
            <Span>Disabled trigger</Span>
          </Div>
          <Span>Simple activations: {simpleActivationCount}</Span>
          <Span>Disabled activations: {disabledActivationCount}</Span>
        </Div>
      </StorySection>

      <StorySection title='Canonical role and aria props'>
        <Div gap={1}>
          <Div
            onPress={() => {}}
            role='button'
            aria-label='Open participant card'
            aria-expanded={false}
            style={{ padding: 16, borderRadius: 12, backgroundColor: '#ecfccb' }}
          >
            <Span>Participant card</Span>
          </Div>
          <Div
            onPress={() => {}}
            role='button'
            aria-label='Selected participant card'
            aria-selected
            style={{ padding: 16, borderRadius: 12, backgroundColor: '#fee2e2' }}
          >
            <Span>Selected participant card</Span>
          </Div>
        </Div>
      </StorySection>
    </StoryStack>
  )
}

export const States: Story = {
  tags: ['interaction'],
  render: () => <DivStates />,
  play: async ({ canvas, userEvent }) => {
    const pressableContainer = canvas.getByRole('button', { name: 'Open sheet', exact: true })
    const simpleTrigger = canvas.getByRole('button', { name: 'Simple trigger' })
    const disabledTrigger = canvas.getByRole('button', { name: 'Disabled trigger' })
    const canonicalButton = canvas.getByRole('button', { name: 'Open participant card', exact: true })
    const selectedButton = canvas.getByRole('button', { name: 'Selected participant card', exact: true })

    expect(pressableContainer.tagName).toBe('DIV')
    expect(simpleTrigger.tagName).toBe('DIV')
    expect(canonicalButton.tagName).toBe('DIV')
    expect(selectedButton.tagName).toBe('DIV')
    await expect(canonicalButton).toHaveAttribute('aria-expanded', 'false')
    await expect(selectedButton).toHaveAttribute('aria-selected', 'true')
    await expect(disabledTrigger).toHaveAttribute('aria-disabled', 'true')
    pressableContainer.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('Activations: 1', { exact: true })).toBeVisible()

    simpleTrigger.focus()
    await userEvent.keyboard(' ')
    await expect(canvas.getByText('Simple activations: 1', { exact: true })).toBeVisible()

    await userEvent.click(disabledTrigger)
    await expect(canvas.getByText('Disabled activations: 0', { exact: true })).toBeVisible()
  }
}
