/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $ } from 'startupjs'
import { ObjectInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function ObjectInputStates () {
  const [$value] = useState(() => $({
    wantsPartner: true,
    partnerName: 'Grace Hopper',
    notes: 'Conditional fields are useful for e2e coverage.'
  }))

  return (
    <StoryStack>
      <StorySection
        title='Conditional fields'
        description='The partner name field is shown only when the toggle is enabled.'
      >
        <ObjectInput
          $value={$value}
          properties={{
            wantsPartner: {
              type: 'boolean',
              label: 'Wants a partner'
            },
            partnerName: {
              type: 'string',
              label: 'Partner name',
              dependsOn: 'wantsPartner',
              dependsValue: true
            },
            notes: {
              type: 'string',
              label: 'Notes',
              input: 'text'
            }
          }}
        />
      </StorySection>
      <Span description>
        This story is useful for dependency-driven visibility and nested layouts.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/ObjectInput',
  component: ObjectInputStates
} satisfies Meta<typeof ObjectInputStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <ObjectInputStates />
}
