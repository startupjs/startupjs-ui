/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $ } from 'startupjs'
import { Input, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function InputStates () {
  const [$value] = useState(() => $({
    name: 'Ada Lovelace',
    age: 29,
    subscribed: true,
    role: 'organizer'
  }))

  return (
    <StoryStack>
      <StorySection title='Universal wrapper'>
        <StoryStack>
          <Input
            $value={$value.name}
            label='Name'
            description='Labelled text field for getByLabel()'
            type='text'
            placeholder='Participant name'
          />
          <Input
            $value={$value.age}
            label='Age'
            type='number'
            description='Numeric value with spinner/input behavior'
          />
          <Input
            $value={$value.subscribed}
            label='Subscribed'
            type='boolean'
          />
          <Input
            $value={$value.role}
            label='Role'
            type='select'
            options={['participant', 'organizer', 'guest']}
          />
        </StoryStack>
      </StorySection>
      <Span description>
        This is the main story for label/layout semantics across the universal wrapper.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Input',
  component: InputStates
} satisfies Meta<typeof InputStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <InputStates />
}
