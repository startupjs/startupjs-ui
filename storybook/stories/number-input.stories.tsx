/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { NumberInput, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

function NumberInputStates () {
  const [distance, setDistance] = useState(42)
  const [price, setPrice] = useState(19.95)

  return (
    <StoryStack>
      <StorySection title='Plain numeric input'>
        <NumberInput
          label='Distance'
          value={distance}
          min={0}
          max={100}
          step={1}
          onChangeNumber={setDistance}
        />
      </StorySection>
      <StorySection title='Units and buttons'>
        <InlineRow>
          <NumberInput
            label='Price'
            value={price}
            step={0.05}
            units='$'
            unitsPosition='left'
            onChangeNumber={setPrice}
          />
          <NumberInput
            label='Readonly'
            value={12}
            readonly
          />
        </InlineRow>
      </StorySection>
      <Span description>
        Use this story to check precision handling, units, and the spinner buttons.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/NumberInput',
  component: NumberInputStates
} satisfies Meta<typeof NumberInputStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <NumberInputStates />
}
