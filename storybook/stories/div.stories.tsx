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

function DivStates () {
  const [activationCount, setActivationCount] = useState(0)

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
            accessibilityRole='button'
            accessibilityLabel='Legacy participant card'
            accessibilityState={{ selected: true }}
            style={{ padding: 16, borderRadius: 12, backgroundColor: '#fee2e2' }}
          >
            <Span>Legacy participant card</Span>
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
    const canonicalButton = canvas.getByRole('button', { name: 'Open participant card', exact: true })
    const legacyButton = canvas.getByRole('button', { name: 'Legacy participant card', exact: true })

    expect(pressableContainer.tagName).toBe('DIV')
    expect(canonicalButton.tagName).toBe('DIV')
    expect(legacyButton.tagName).toBe('DIV')
    await expect(canonicalButton).toHaveAttribute('aria-expanded', 'false')
    await expect(legacyButton).toHaveAttribute('aria-selected', 'true')

    pressableContainer.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('Activations: 1', { exact: true })).toBeVisible()
  }
}
