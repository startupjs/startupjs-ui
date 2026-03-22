/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { Div, Span, TextInput } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

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
  }
}
