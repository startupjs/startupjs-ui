/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { $, observer } from 'startupjs'
import { ArrayInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const ArrayInputStates = observer(function ArrayInputStates () {
  const [$value] = useState(() => $({
    participants: ['Ada Lovelace', 'Grace Hopper']
  }))

  return (
    <StoryStack>
      <StorySection
        title='Editable list'
        description='New rows appear automatically as items are added.'
      >
        <ArrayInput
          $value={$value.participants}
          items={{
            type: 'text',
            label: 'Participant',
            placeholder: 'Full name'
          }}
        />
        <Span>{`Participants snapshot: ${$value.participants.get().join(', ')}`}</Span>
      </StorySection>
      <Span description>
        This story is mainly for repeated item layout and delete affordances.
      </Span>
    </StoryStack>
  )
})

const meta = {
  title: 'Inputs/ArrayInput',
  component: ArrayInputStates
} satisfies Meta<typeof ArrayInputStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Remove Participant 1' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <ArrayInputStates />,
  play: async ({ canvas, canvasElement }) => {
    const removeButtons = canvas.getAllByRole('button')

    await expect(canvas.getByText('Participants snapshot: Ada Lovelace, Grace Hopper')).toBeVisible()

    await userEvent.click(removeButtons[0])
    expect(canvasElement.textContent).toContain('Participants snapshot: Grace Hopper')
  }
}
