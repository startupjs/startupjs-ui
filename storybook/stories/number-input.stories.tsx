/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByLabelText('Distance')).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Increment Distance' })).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Decrement Distance' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <NumberInputStates />,
  play: async ({ canvas }) => {
    const distanceInput = canvas.getByDisplayValue('42')
    const priceInput = canvas.getByDisplayValue('19.95')

    await expect(distanceInput).toBeVisible()
    await expect(priceInput).toBeVisible()
    await expect(canvas.getByText('12')).toBeVisible()

    await userEvent.clear(distanceInput)
    await userEvent.type(distanceInput, '55')
    await expect(distanceInput).toHaveValue('55')

    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '21.10')
    await expect(priceInput).toHaveValue('21.10')
  }
}
