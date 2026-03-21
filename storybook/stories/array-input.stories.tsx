/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $ } from 'startupjs'
import { ArrayInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function ArrayInputStates () {
  const [$value] = useState(() => $({
    participants: ['Ada Lovelace', 'Grace Hopper']
  }))

  return (
    <StoryStack>
      <StorySection
        title='Editable list'
        description='New rows appear automatically as items are added.'
      >
        <ArrayInput
          $value={$value.participants}
          items={{
            type: 'text',
            label: 'Participant',
            placeholder: 'Full name'
          }}
        />
      </StorySection>
      <Span description>
        This story is mainly for repeated item layout and delete affordances.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/ArrayInput',
  component: ArrayInputStates
} satisfies Meta<typeof ArrayInputStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <ArrayInputStates />
}
