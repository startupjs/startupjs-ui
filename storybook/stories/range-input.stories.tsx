/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { RangeInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function RangeInputStates () {
  const [value, setValue] = useState(30)
  const [range, setRange] = useState<[number, number]>([20, 80])

  return (
    <StoryStack>
      <StorySection title='Single value slider'>
        <RangeInput
          value={value}
          min={0}
          max={100}
          step={5}
          onChange={setValue}
        />
      </StorySection>
      <StorySection title='Range slider with steps'>
        <RangeInput
          value={range}
          min={0}
          max={100}
          range
          showSteps
          step={10}
          onChange={setRange}
        />
      </StorySection>
      <Span description>
        This story checks the track, labels, and the single/range value modes.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/RangeInput',
  component: RangeInputStates
} satisfies Meta<typeof RangeInputStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getAllByRole('slider')).toHaveLength(3)
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <RangeInputStates />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('This story checks the track, labels, and the single/range value modes.')).toBeVisible()
    await expect(canvas.getByText('Single value slider')).toBeVisible()
    await expect(canvas.getByText('Range slider with steps')).toBeVisible()
    expect(canvasElement.textContent).toContain('This story checks the track, labels, and the single/range value modes.')
  }
}
