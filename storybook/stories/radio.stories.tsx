/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Input, Radio, Span } from 'startupjs-ui'
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
        <Input
          type='radio'
          label='Gender'
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
      <StorySection title='Low-level radio group'>
        <Radio
          value={valueRow}
          options={OPTIONS}
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
  tags: ['interaction'],
  render: () => <RadioStates />,
  play: async ({ canvas, userEvent }) => {
    const wrappedWoman = canvas.getAllByRole('radio', { name: 'Woman', exact: true })[0]
    const lowLevelOther = canvas.getAllByRole('radio', { name: 'Other', exact: true }).at(-1)

    await userEvent.click(wrappedWoman)
    await expect(wrappedWoman).toHaveAttribute('aria-checked', 'true')

    if (lowLevelOther) {
      await userEvent.click(lowLevelOther)
      await expect(lowLevelOther).toHaveAttribute('aria-checked', 'true')
    }
  }
}
