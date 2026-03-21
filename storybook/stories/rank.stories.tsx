/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Rank, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'concept', label: 'Concept' },
  { value: 'build', label: 'Build' },
  { value: 'launch', label: 'Launch' }
]

function RankStates () {
  const [value, setValue] = useState(['concept', 'build', 'launch'])

  return (
    <StoryStack>
      <StorySection title='Interactive ranking'>
        <Rank
          options={OPTIONS}
          value={value}
          onChange={setValue}
        />
      </StorySection>
      <StorySection title='Readonly ranking'>
        <Rank
          options={OPTIONS}
          value={value}
          readonly
        />
      </StorySection>
      <Span description>
        This story is useful for drag/drop and ordering behavior.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Rank',
  component: RankStates
} satisfies Meta<typeof RankStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <RankStates />
}
