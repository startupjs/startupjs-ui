/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { MultiSelect, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'hedy', label: 'Hedy Lamarr' },
  { value: 'margaret', label: 'Margaret Hamilton' }
]

function MultiSelectStates () {
  const [value, setValue] = useState(['ada', 'grace'])
  const [limited, setLimited] = useState(['ada', 'grace', 'hedy'])

  return (
    <StoryStack>
      <StorySection title='Selected tags'>
        <MultiSelect
          options={OPTIONS}
          value={value}
          placeholder='Select people'
          onChange={setValue}
        />
      </StorySection>
      <StorySection title='Tag limit'>
        <MultiSelect
          options={OPTIONS}
          value={limited}
          placeholder='Limited selection'
          tagLimit={2}
          tagLimitVariant='hidden'
          onChange={setLimited}
        />
      </StorySection>
      <Span description>
        This story is mostly about chip layout, keyboard focus, and option visibility.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/MultiSelect',
  component: MultiSelectStates
} satisfies Meta<typeof MultiSelectStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => <MultiSelectStates />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getAllByRole('button')[0]

    await expect(trigger).toBeVisible()
    await userEvent.click(trigger)

    expect(canvasElement.querySelectorAll('button button')).toHaveLength(0)
  }
}
