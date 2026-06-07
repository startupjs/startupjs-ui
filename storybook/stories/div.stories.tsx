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

const OUTER_TEXT_COLOR = 'rgb(185, 28, 28)'
const NESTED_TEXT_COLOR = 'rgb(37, 99, 235)'
const SPAN_OVERRIDE_COLOR = 'rgb(22, 163, 74)'

function getByNormalizedText (canvas: PlayContext['canvas'], text: string) {
  return canvas.getByText((_, element) => {
    const normalizedText = element?.textContent?.replace(/\s+/g, ' ').trim()
    return normalizedText === text
  })
}

function getStyle (element: Element): CSSStyleDeclaration {
  const view = element.ownerDocument.defaultView
  if (!view) throw Error('Expected element to have a window')
  return view.getComputedStyle(element)
}

function expectPx (value: string, expected: number) {
  expect(Math.round(parseFloat(value))).toBe(expected)
}

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

function DivTextStyleInheritance () {
  return (
    <StoryStack>
      <StorySection title='Text style inheritance'>
        <Div
          testID='div-text-style-host'
          gap={1}
          style={{
            color: '#b91c1c',
            fontSize: 20,
            fontWeight: '700',
            letterSpacing: 2,
            lineHeight: 1.5,
            textAlign: 'center',
            textTransform: 'uppercase',
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#f9fafb'
          }}
        >
          <Span>Div inherited alpha</Span>
          <Span>Div inherited beta</Span>

          <Div
            style={{
              color: '#2563eb',
              fontSize: 16,
              lineHeight: 2,
              padding: 8,
              backgroundColor: '#eff6ff'
            }}
          >
            <Span>Nested div override</Span>
          </Div>

          <Span testID='span-override-owner' style={{ color: '#16a34a', fontSize: 18, lineHeight: 1.25 }}>
            Span override owner
          </Span>
        </Div>

        <Div
          style={{
            fontSize: 15,
            lineHeight: 28
          }}
        >
          <Span>Absolute line height remains</Span>
        </Div>
      </StorySection>
    </StoryStack>
  )
}

export const States: Story = {
  tags: ['interaction'],
  render: () => <DivStates />,
  play: async ({ canvas, userEvent }) => {
    const pressableContainer = canvas.getByRole('button', { name: 'Open sheet' })
    const simpleTrigger = canvas.getByRole('button', { name: 'Simple trigger' })
    const disabledTrigger = canvas.getByRole('button', { name: 'Disabled trigger' })
    const canonicalButton = canvas.getByRole('button', { name: 'Open participant card' })
    const selectedButton = canvas.getByRole('button', { name: 'Selected participant card' })

    expect(pressableContainer.tagName).toBe('DIV')
    expect(simpleTrigger.tagName).toBe('DIV')
    expect(canonicalButton.tagName).toBe('DIV')
    expect(selectedButton.tagName).toBe('DIV')
    await expect(canonicalButton).toHaveAttribute('aria-expanded', 'false')
    await expect(selectedButton).toHaveAttribute('aria-selected', 'true')
    await expect(disabledTrigger).toHaveAttribute('aria-disabled', 'true')
    pressableContainer.focus()
    await userEvent.keyboard('{Enter}')
    await expect(getByNormalizedText(canvas, 'Activations: 1')).toBeVisible()

    simpleTrigger.focus()
    await userEvent.keyboard(' ')
    await expect(getByNormalizedText(canvas, 'Simple activations: 1')).toBeVisible()

    await userEvent.click(disabledTrigger)
    await expect(getByNormalizedText(canvas, 'Disabled activations: 0')).toBeVisible()
  }
}

export const TextStyleInheritance: Story = {
  tags: ['interaction'],
  render: () => <DivTextStyleInheritance />,
  play: async ({ canvas }) => {
    const host = canvas.getByTestId('div-text-style-host')
    const inheritedAlpha = canvas.getByText('Div inherited alpha', { exact: true })
    const inheritedBeta = canvas.getByText('Div inherited beta', { exact: true })
    const nestedDivOverride = canvas.getByText('Nested div override', { exact: true })
    const spanOverrideOwner = canvas.getByTestId('span-override-owner')
    const absoluteLineHeight = canvas.getByText('Absolute line height remains', { exact: true })

    const hostStyle = getStyle(host)
    expect(hostStyle.color).not.toBe(OUTER_TEXT_COLOR)
    expectPx(hostStyle.fontSize, 16)

    for (const inheritedText of [inheritedAlpha, inheritedBeta]) {
      const style = getStyle(inheritedText)
      expect(style.color).toBe(OUTER_TEXT_COLOR)
      expect(style.fontWeight).toBe('700')
      expect(style.textAlign).toBe('center')
      expect(style.textTransform).toBe('uppercase')
      expectPx(style.fontSize, 20)
      expectPx(style.lineHeight, 30)
      expectPx(style.letterSpacing, 2)
    }

    const nestedOverrideStyle = getStyle(nestedDivOverride)
    expect(nestedOverrideStyle.color).toBe(NESTED_TEXT_COLOR)
    expect(nestedOverrideStyle.fontWeight).toBe('700')
    expect(nestedOverrideStyle.textTransform).toBe('uppercase')
    expectPx(nestedOverrideStyle.fontSize, 16)
    expectPx(nestedOverrideStyle.lineHeight, 32)
    expectPx(nestedOverrideStyle.letterSpacing, 2)

    const spanOverrideStyle = getStyle(spanOverrideOwner)
    expect(spanOverrideStyle.color).toBe(SPAN_OVERRIDE_COLOR)
    expectPx(spanOverrideStyle.fontSize, 18)
    expectPx(spanOverrideStyle.lineHeight, 23)

    expectPx(getStyle(absoluteLineHeight).lineHeight, 28)
  }
}
