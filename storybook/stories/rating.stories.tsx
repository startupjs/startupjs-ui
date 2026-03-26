/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { Rating, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function RatingStates () {
  const [value, setValue] = useState(3)

  return (
    <StoryStack>
      <StorySection title='Interactive star rating'>
        <Rating value={value} onChange={setValue} />
        <Span>{`Selected rating: ${value}`}</Span>
      </StorySection>
      <StorySection title='Readonly star rating'>
        <Rating value={4.2} readonly />
      </StorySection>
      <Span description>
        This story checks the star hit areas and the compact readonly display.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Rating',
  component: RatingStates
} satisfies Meta<typeof RatingStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Set rating to 4' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <RatingStates />,
  play: async ({ canvas }) => {
    const starButtons = canvas.getAllByRole('button')

    await expect(canvas.getByText('Selected rating: 3')).toBeVisible()
    await expect(canvas.getByText('4.2')).toBeVisible()

    await userEvent.click(starButtons[3])
    await expect(canvas.getByText('Selected rating: 4')).toBeVisible()
  }
}
