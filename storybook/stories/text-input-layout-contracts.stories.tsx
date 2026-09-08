import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent, waitFor } from 'storybook/test'
import { Div, Input, Span, TextInput } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const LONG_PLACEHOLDER = 'A very long placeholder that should not define the control width'
const LAYOUT_TOLERANCE = 4

function TextInputLayoutContracts () {
  const [resizeValue, setResizeValue] = useState('')
  const [resizeFlexValue, setResizeFlexValue] = useState('')

  return (
    <StoryStack>
      <StorySection
        title='Fits a narrow parent'
        description='A long placeholder must not make a control wider than its 50px parent.'
      >
        <Div gap={1.5}>
          <Span description>Column layout</Span>
          <Div row wrap gap={2}>
            <Div testID='column-shrink-text-input' style={{ width: 50, height: 80 }}>
              <TextInput
                placeholder={LONG_PLACEHOLDER}
              />
            </Div>
            <Div testID='column-shrink-input' style={{ width: 50, height: 80 }}>
              <Input
                type='text'
                placeholder={LONG_PLACEHOLDER}
              />
            </Div>
          </Div>
          <Span description>Row layout</Span>
          <Div row wrap gap={2}>
            <Div row testID='row-shrink-text-input' style={{ width: 50, height: 80, alignItems: 'flex-start' }}>
              <TextInput
                placeholder={LONG_PLACEHOLDER}
              />
            </Div>
            <Div row testID='row-shrink-input' style={{ width: 50, height: 80, alignItems: 'flex-start' }}>
              <Input
                type='text'
                placeholder={LONG_PLACEHOLDER}
              />
            </Div>
          </Div>
        </Div>
      </StorySection>

      <StorySection
        title='Natural multi-line height'
        description='Two lines keep their natural height in column and in a row with alignItems flex-start.'
      >
        <Div gap={1.5}>
          <Span description>Column layout: one line and two lines</Span>
          <Div row wrap gap={2}>
            <Div testID='column-single-line-text-input' style={{ width: 100, height: 300 }}>
              <TextInput />
            </Div>
            <Div testID='column-single-line-input' style={{ width: 100, height: 300 }}>
              <Input type='text' />
            </Div>
            <Div testID='column-natural-text-input' style={{ width: 100, height: 300 }}>
              <TextInput numberOfLines={2} />
            </Div>
            <Div testID='column-natural-input' style={{ width: 100, height: 300 }}>
              <Input type='text' numberOfLines={2} />
            </Div>
          </Div>
          <Span description>Row layout: one line and two lines</Span>
          <Div row wrap gap={2}>
            <Div row testID='row-single-line-text-input' style={{ width: 100, height: 300, alignItems: 'flex-start' }}>
              <TextInput />
            </Div>
            <Div row testID='row-single-line-input' style={{ width: 100, height: 300, alignItems: 'flex-start' }}>
              <Input type='text' />
            </Div>
            <Div row testID='row-natural-text-input' style={{ width: 100, height: 300, alignItems: 'flex-start' }}>
              <TextInput numberOfLines={2} />
            </Div>
            <Div row testID='row-natural-input' style={{ width: 100, height: 300, alignItems: 'flex-start' }}>
              <Input type='text' numberOfLines={2} />
            </Div>
          </Div>
        </Div>
      </StorySection>

      <StorySection
        title='Fills flex space'
        description='A control fills the space allocated by a column or row flex parent.'
      >
        <Div gap={1.5}>
          <Span description>Default · Column layout</Span>
          <Div row wrap gap={2}>
            <Div testID='column-flex-default-text-input' style={{ width: 100, height: 300 }}>
              <TextInput style={{ flex: 1 }} />
            </Div>
            <Div testID='column-flex-default-input' style={{ width: 100, height: 300 }}>
              <Input type='text' style={{ flex: 1 }} />
            </Div>
          </Div>
          <Span description>Default · Row layout</Span>
          <Div row wrap gap={2}>
            <Div row testID='row-flex-default-text-input' style={{ width: 100, height: 300 }}>
              <TextInput style={{ flex: 1 }} />
            </Div>
            <Div row testID='row-flex-default-input' style={{ width: 100, height: 300 }}>
              <Input type='text' style={{ flex: 1 }} />
            </Div>
          </Div>
          <Span description>Two lines · Column layout</Span>
          <Div row wrap gap={2}>
            <Div testID='column-flex-two-lines-text-input' style={{ width: 100, height: 300 }}>
              <TextInput numberOfLines={2} style={{ flex: 1 }} />
            </Div>
            <Div testID='column-flex-two-lines-input' style={{ width: 100, height: 300 }}>
              <Input type='text' numberOfLines={2} style={{ flex: 1 }} />
            </Div>
          </Div>
          <Span description>Two lines · Row layout</Span>
          <Div row wrap gap={2}>
            <Div row testID='row-flex-two-lines-text-input' style={{ width: 100, height: 300 }}>
              <TextInput numberOfLines={2} style={{ flex: 1 }} />
            </Div>
            <Div row testID='row-flex-two-lines-input' style={{ width: 100, height: 300 }}>
              <Input type='text' numberOfLines={2} style={{ flex: 1 }} />
            </Div>
          </Div>
        </Div>
      </StorySection>

      <StorySection
        title='Resizes with content'
        description='A textarea grows with its content and shrinks back to its two-line minimum after clearing.'
      >
        <Div gap={1.5}>
          <Span description>Column layout</Span>
          <Div row wrap gap={2}>
            <Div testID='column-resize-text-input' style={{ width: 100 }}>
              <TextInput
                numberOfLines={2}
                resize
                value={resizeValue}
                onChangeText={setResizeValue}
              />
            </Div>
            <Div testID='column-resize-input' style={{ width: 100 }}>
              <Input
                type='text'
                numberOfLines={2}
                resize
                value={resizeValue}
                onChangeText={setResizeValue}
              />
            </Div>
          </Div>
          <Span description>Row layout</Span>
          <Div row wrap gap={2}>
            <Div row testID='row-resize-text-input' style={{ width: 100, alignItems: 'flex-start' }}>
              <TextInput
                numberOfLines={2}
                resize
                value={resizeValue}
                onChangeText={setResizeValue}
              />
            </Div>
            <Div row testID='row-resize-input' style={{ width: 100, alignItems: 'flex-start' }}>
              <Input
                type='text'
                numberOfLines={2}
                resize
                value={resizeValue}
                onChangeText={setResizeValue}
              />
            </Div>
          </Div>
        </Div>
      </StorySection>

      <StorySection
        title='Stays inside flex space while resizing'
        description='A resizing textarea stays within the space allocated by flex layout.'
      >
        <Div gap={1.5}>
          <Span description>Column layout</Span>
          <Div row wrap gap={2}>
            <Div testID='column-resize-flex-text-input' style={{ width: 100, height: 300 }}>
              <TextInput
                numberOfLines={2}
                resize
                style={{ flex: 1 }}
                value={resizeFlexValue}
                onChangeText={setResizeFlexValue}
              />
            </Div>
            <Div testID='column-resize-flex-input' style={{ width: 100, height: 300 }}>
              <Input
                type='text'
                numberOfLines={2}
                resize
                style={{ flex: 1 }}
                value={resizeFlexValue}
                onChangeText={setResizeFlexValue}
              />
            </Div>
          </Div>
          <Span description>Row layout</Span>
          <Div row wrap gap={2}>
            <Div row testID='row-resize-flex-text-input' style={{ width: 100, height: 300 }}>
              <TextInput
                numberOfLines={2}
                resize
                style={{ flex: 1 }}
                value={resizeFlexValue}
                onChangeText={setResizeFlexValue}
              />
            </Div>
            <Div row testID='row-resize-flex-input' style={{ width: 100, height: 300 }}>
              <Input
                type='text'
                numberOfLines={2}
                resize
                style={{ flex: 1 }}
                value={resizeFlexValue}
                onChangeText={setResizeFlexValue}
              />
            </Div>
          </Div>
        </Div>
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/TextInput',
  component: TextInputLayoutContracts
} satisfies Meta<typeof TextInputLayoutContracts>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

function getRoot (host: HTMLElement): HTMLElement {
  const root = host.firstElementChild
  if (!root) throw Error('Expected a control root inside the layout fixture')
  return root as HTMLElement
}

function getNativeControl (host: HTMLElement): HTMLElement {
  const control = host.querySelector('input, textarea')
  if (!control) throw Error('Expected a native input inside the layout fixture')
  return control as HTMLElement
}

function expectFits (child: HTMLElement, parent: HTMLElement) {
  const childRect = child.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  expect(childRect.left).toBeGreaterThanOrEqual(parentRect.left - LAYOUT_TOLERANCE)
  expect(childRect.top).toBeGreaterThanOrEqual(parentRect.top - LAYOUT_TOLERANCE)
  expect(childRect.right).toBeLessThanOrEqual(parentRect.right + LAYOUT_TOLERANCE)
  expect(childRect.bottom).toBeLessThanOrEqual(parentRect.bottom + LAYOUT_TOLERANCE)
}

function expectFillsWidth (child: HTMLElement, parent: HTMLElement) {
  const childRect = child.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  expect(childRect.width).toBeGreaterThanOrEqual(parentRect.width - LAYOUT_TOLERANCE)
  expectFits(child, parent)
}

function expectFillsHeight (child: HTMLElement, parent: HTMLElement) {
  const childRect = child.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  expect(childRect.height).toBeGreaterThanOrEqual(parentRect.height - LAYOUT_TOLERANCE)
  expectFits(child, parent)
}

function expectNativeControlFillsRoot (host: HTMLElement) {
  const root = getRoot(host)
  const control = getNativeControl(host)

  expectFillsWidth(control, root)
  expectFillsHeight(control, root)
}

async function testLayoutContracts ({ canvas, step }: PlayContext) {
  const host = (testID: string) => canvas.getByTestId(testID) as HTMLElement
  const shrinkIds = [
    'column-shrink-text-input',
    'column-shrink-input',
    'row-shrink-text-input',
    'row-shrink-input'
  ]
  const flexIds = [
    'column-flex-default-text-input',
    'column-flex-default-input',
    'row-flex-default-text-input',
    'row-flex-default-input',
    'column-flex-two-lines-text-input',
    'column-flex-two-lines-input',
    'row-flex-two-lines-text-input',
    'row-flex-two-lines-input'
  ]
  const resizeIds = [
    'column-resize-text-input',
    'column-resize-input',
    'row-resize-text-input',
    'row-resize-input'
  ]
  const resizeFlexIds = [
    'column-resize-flex-text-input',
    'column-resize-flex-input',
    'row-resize-flex-text-input',
    'row-resize-flex-input'
  ]

  await step('Fits a narrow parent', () => {
    for (const testID of shrinkIds) {
      const fixture = host(testID)
      expectFillsWidth(getRoot(fixture), fixture)
      expectNativeControlFillsRoot(fixture)
    }
  })

  await step('Natural multi-line height', () => {
    for (const kind of ['text-input', 'input'] as const) {
      for (const direction of ['column', 'row'] as const) {
        const singleLine = getRoot(host(`${direction}-single-line-${kind}`)).getBoundingClientRect()
        const fixture = host(`${direction}-natural-${kind}`)
        const root = getRoot(fixture)

        expect(root.getBoundingClientRect().height).toBeGreaterThan(singleLine.height + LAYOUT_TOLERANCE)
        expectFits(root, fixture)
        expectNativeControlFillsRoot(fixture)
      }
    }
  })

  await step('Fills flex space', () => {
    for (const testID of flexIds) {
      const fixture = host(testID)
      const root = getRoot(fixture)

      expectFillsWidth(root, fixture)
      expectFillsHeight(root, fixture)
      expectNativeControlFillsRoot(fixture)
    }
  })

  await step('Resizes with content', async () => {
    const resizeInitialHeights = new Map(resizeIds.map(testID => [
      testID,
      getRoot(host(testID)).getBoundingClientRect().height
    ]))
    await userEvent.type(getNativeControl(host('column-resize-text-input')), 'One\nTwo\nThree\nFour')
    await waitFor(() => {
      for (const testID of resizeIds) {
        const height = getRoot(host(testID)).getBoundingClientRect().height
        expect(height).toBeGreaterThan((resizeInitialHeights.get(testID) ?? 0) + LAYOUT_TOLERANCE)
      }
    })
    await userEvent.clear(getNativeControl(host('column-resize-text-input')))
    await waitFor(() => {
      for (const testID of resizeIds) {
        const height = getRoot(host(testID)).getBoundingClientRect().height
        expect(Math.abs(height - (resizeInitialHeights.get(testID) ?? 0))).toBeLessThanOrEqual(LAYOUT_TOLERANCE)
      }
    })
  })

  await step('Stays inside flex space while resizing', async () => {
    await userEvent.type(getNativeControl(host('column-resize-flex-text-input')), 'One\nTwo\nThree\nFour')
    await waitFor(() => {
      for (const testID of resizeFlexIds) {
        const fixture = host(testID)
        const root = getRoot(fixture)

        expectFillsWidth(root, fixture)
        expectFillsHeight(root, fixture)
        expectNativeControlFillsRoot(fixture)
      }
    })
  })
}

export const LayoutContracts: Story = {
  tags: ['interaction'],
  render: () => <TextInputLayoutContracts />,
  play: testLayoutContracts
}
