/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $ } from 'startupjs'
import { Form, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function FormStates () {
  const [$value] = useState(() => $({
    name: '',
    age: 27,
    role: 'participant',
    agreed: true,
    notes: 'Mostly interested in interface testing'
  }))

  const fields = {
    name: {
      type: 'string',
      label: 'Full name',
      placeholder: 'Ada Lovelace',
      required: true
    },
    age: {
      type: 'number',
      label: 'Age',
      min: 18,
      max: 99
    },
    role: {
      type: 'string',
      label: 'Role',
      enum: ['participant', 'organizer', 'guest']
    },
    agreed: {
      type: 'boolean',
      label: 'Agree to the rules'
    },
    notes: {
      type: 'string',
      label: 'Notes',
      description: 'Shown to demonstrate longer text and rows layout.',
      input: 'text'
    }
  }

  return (
    <StoryStack>
      <StorySection
        title='Validation form'
        description='Empty required fields should surface errors immediately.'
      >
        <Form
          $value={$value}
          fields={fields}
          validate
        />
      </StorySection>
      <Span description>
        This story exercises the form wrapper, label semantics, and nested input composition.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Form',
  component: FormStates
} satisfies Meta<typeof FormStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <FormStates />
}
