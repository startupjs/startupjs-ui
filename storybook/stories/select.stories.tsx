/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Select, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'participant', label: 'Participant' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'guest', label: 'Guest' }
]

function SelectStates () {
  const [value, setValue] = useState<string | undefined>('organizer')

  return (
    <StoryStack>
      <StorySection title='Basic select'>
        <Select
          label='Role'
          options={OPTIONS}
          value={value}
          onChange={setValue}
        />
      </StorySection>
      <StorySection title='Empty and disabled'>
        <InlineRow>
          <Select
            label='Optional role'
            options={OPTIONS}
            emptyValueLabel='Choose a role'
            value={undefined}
            onChange={() => {}}
          />
          <Select
            label='Disabled role'
            options={OPTIONS}
            value='guest'
            disabled
            onChange={() => {}}
          />
        </InlineRow>
      </StorySection>
      <Span description>
        This story is mainly about the wrapper semantics and the overlay option list on web.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Select',
  component: SelectStates
} satisfies Meta<typeof SelectStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <SelectStates />
}
