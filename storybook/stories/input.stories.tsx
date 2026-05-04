/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { $, observer } from 'startupjs'
import { Input, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const InputStates = observer(function InputStates () {
  const $value = $({
    name: 'Ada Lovelace',
    age: 29,
    subscribed: true,
    role: 'organizer'
  })

  return (
    <StoryStack>
      <StorySection title='Universal wrapper'>
        <StoryStack>
          <Input
            $value={$value.name}
            label='Name'
            required
            description='Labelled text field for getByLabel()'
            type='text'
            placeholder='Participant name'
          />
          <Input
            $value={$value.age}
            label='Age'
            type='number'
            description='Numeric value with spinner/input behavior'
          />
          <Input
            $value={$value.subscribed}
            label='Subscribed'
            type='boolean'
          />
          <Input
            $value={$value.role}
            label='Role'
            type='select'
            options={['participant', 'organizer', 'guest']}
          />
          <Input
            $value={$value.name}
            label='Error name'
            description='The wrapper should expose both description and error semantics.'
            type='text'
            error='This field is required'
            placeholder='Person name'
          />
        </StoryStack>
      </StorySection>
      <Span description>
        This is the main story for label/layout semantics across the universal wrapper.
      </Span>
    </StoryStack>
  )
})

const meta = {
  title: 'Inputs/Input',
  component: InputStates
} satisfies Meta<typeof InputStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByLabelText('Age')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <InputStates />,
  play: async ({ canvas, userEvent }) => {
    const nameField = canvas.getByLabelText('Name')
    const nameWithErrorField = canvas.getByLabelText('Error name')

    await expect(nameField).toBeVisible()
    await expect(nameWithErrorField).toBeVisible()

    await userEvent.clear(nameField)
    await userEvent.type(nameField, 'Grace Hopper')

    await expect(nameField).toHaveValue('Grace Hopper')
    await expect(nameWithErrorField).toHaveAttribute('aria-invalid', 'true')
  }
}
