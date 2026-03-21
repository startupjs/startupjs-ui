/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Radio, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'man', label: 'Man' },
  { value: 'woman', label: 'Woman' },
  { value: 'other', label: 'Other' }
]

function RadioStates () {
  const [value, setValue] = useState('man')
  const [valueRow, setValueRow] = useState('woman')

  return (
    <StoryStack>
      <StorySection title='Stacked options'>
        <Radio
          value={value}
          options={OPTIONS}
          onChange={setValue}
        />
      </StorySection>
      <StorySection title='Row layout'>
        <Radio
          value={valueRow}
          options={OPTIONS}
          row
          onChange={setValueRow}
        />
      </StorySection>
      <Span description>
        This story is for single-choice semantics and option grouping.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Radio',
  component: RadioStates
} satisfies Meta<typeof RadioStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <RadioStates />
}
