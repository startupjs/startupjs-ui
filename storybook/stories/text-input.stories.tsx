/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Div, Span, TextInput } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function TextInputStates () {
  const [value, setValue] = useState('Ada Lovelace')
  const [multiline, setMultiline] = useState('Line one\nLine two')

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
            placeholder='Search'
            onChangeText={() => {}}
          />
          <TextInput
            value='Read only preview'
            disabled
            icon={faSearch}
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
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/TextInput',
  component: TextInputStates
} satisfies Meta<typeof TextInputStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => <TextInputStates />
}
