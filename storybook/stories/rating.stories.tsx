/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Rating, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function RatingStates () {
  const [value, setValue] = useState(3)

  return (
    <StoryStack>
      <StorySection title='Interactive star rating'>
        <Rating value={value} onChange={setValue} />
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

export const States: Story = {
  render: () => <RatingStates />
}
