/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { Div, Span, TextInput } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const INPUT_STYLE_COLOR = 'rgb(22, 163, 74)'
const ICON_STYLE_COLOR = '#dc2626'
const SECONDARY_ICON_STYLE_COLOR = '#2563eb'

function getStyle (element: Element): CSSStyleDeclaration {
  const view = element.ownerDocument.defaultView
  if (!view) throw Error('Expected element to have a window')
  return view.getComputedStyle(element)
}

function TextInputContractIcon ({
  color,
  fill,
  width,
  height
}: {
  color?: string
  fill?: string
  width?: number
  height?: number
}) {
  return (
    <svg
      data-testid='text-input-contract-icon'
      data-color={color}
      data-fill={fill}
      data-width={width}
      data-height={height}
      width={width}
      height={height}
      viewBox='0 0 32 32'
    >
      <circle cx='16' cy='16' r='14' fill='currentColor' />
    </svg>
  )
}

function TextInputStates () {
  const [value, setValue] = useState('Ada Lovelace')
  const [multiline, setMultiline] = useState('Line one\nLine two')
  const [iconPresses, setIconPresses] = useState(0)

  return (
    <StoryStack>
      <StorySection title='Single line'>
        <TextInput
          value={value}
          placeholder='Participant name'
          aria-label='Participant name'
          onChangeText={setValue}
        />
      </StorySection>
      <StorySection title='Icons and disabled'>
        <Div gap={1.5}>
          <TextInput
            value='Search entries'
            icon={faSearch}
            aria-label='Search entries'
            placeholder='Search'
            onIconPress={() => { setIconPresses(v => v + 1) }}
            onChangeText={() => {}}
          />
          <TextInput
            value='Read only preview'
            disabled
            icon={faSearch}
            aria-label='Read only preview'
            onChangeText={() => {}}
          />
        </Div>
      </StorySection>
      <StorySection title='Style contracts'>
        <Div testID='text-input-style-contract'>
          <TextInput
            value='Styled input'
            aria-label='Styled input contract'
            testID='styled-input-contract'
            icon={TextInputContractIcon}
            secondaryIcon={TextInputContractIcon}
            inputStyle={{ color: '#16a34a', lineHeight: 24 }}
            iconStyle={{ color: ICON_STYLE_COLOR }}
            secondaryIconStyle={{ color: SECONDARY_ICON_STYLE_COLOR }}
            onChangeText={() => {}}
          />
        </Div>
      </StorySection>
      <StorySection title='Multiline / resize'>
        <TextInput
          value={multiline}
          numberOfLines={2}
          resize
          onChangeText={setMultiline}
        />
      </StorySection>
      <Span description>
        This is the main candidate for future `getByLabel(...)` improvements on web.
      </Span>
      <Span>Icon presses: {iconPresses}</Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/TextInput',
  component: TextInputStates
} satisfies Meta<typeof TextInputStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Search entries icon' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <TextInputStates />,
  play: async ({ canvas }) => {
    const nameInput = canvas.getByRole('textbox', { name: 'Participant name' })
    const searchInput = canvas.getByRole('textbox', { name: 'Search entries' })
    const readonlyInput = canvas.getByRole('textbox', { name: 'Read only preview' })

    await expect(nameInput).toBeVisible()
    await expect(searchInput).toBeVisible()
    await expect(readonlyInput).toBeVisible()

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Grace Hopper')
    await expect(nameInput).toHaveValue('Grace Hopper')
    await expect(readonlyInput).toBeDisabled()
    await expect(canvas.getByText('Icon presses: 0')).toBeVisible()

    const styledInput = canvas.getByTestId('styled-input-contract')
    const styledInputStyle = getStyle(styledInput)
    expect(styledInputStyle.color).toBe(INPUT_STYLE_COLOR)
    expect(Math.round(parseFloat(styledInputStyle.lineHeight))).toBe(24)

    const styleContract = canvas.getByTestId('text-input-style-contract')
    const icons = Array.from(styleContract.querySelectorAll('[data-testid="text-input-contract-icon"]'))
    expect(icons.length).toBe(2)
    expect(icons[0].getAttribute('data-color')).toBe(ICON_STYLE_COLOR)
    expect(icons[0].getAttribute('data-fill')).toBe(ICON_STYLE_COLOR)
    expect(icons[1].getAttribute('data-color')).toBe(SECONDARY_ICON_STYLE_COLOR)
    expect(icons[1].getAttribute('data-fill')).toBe(SECONDARY_ICON_STYLE_COLOR)
  }
}
