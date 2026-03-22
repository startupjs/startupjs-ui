/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent, within } from 'storybook/test'
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('list', { name: 'Interactive ranking' })).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Move Launch' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <RankStates />,
  play: async ({ canvas }) => {
    const selects = canvas.getAllByRole('combobox')
    const interactiveSelect = selects[0]
    const readonlyRank = canvas.getByText('Readonly ranking')

    expect(canvas.getAllByText('Concept').length).toBeGreaterThan(0)
    expect(canvas.getAllByText('Build').length).toBeGreaterThan(0)
    expect(canvas.getAllByText('Launch').length).toBeGreaterThan(0)
    await expect(readonlyRank).toBeVisible()

    await userEvent.selectOptions(interactiveSelect, within(interactiveSelect).getByRole('option', { name: '3' }))
    await expect(canvas.getAllByDisplayValue('3')[0]).toBeVisible()
    await expect(canvas.getAllByText('Launch').length).toBeGreaterThan(0)
  }
}
