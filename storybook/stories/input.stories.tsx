/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, waitFor } from 'storybook/test'
import { $, observer } from 'startupjs'
import { Input, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const InputStates = observer(function InputStates () {
  const $value = $({
    name: 'Ada Lovelace',
    age: 29,
    subscribed: true,
    role: 'organizer',
    password: 'analytical-engine',
    startDate: Date.UTC(2026, 0, 21),
    startTime: Date.UTC(2026, 0, 21, 9, 30),
    startDatetime: Date.UTC(2026, 0, 21, 14, 45),
    people: ['ada'],
    color: '#336699',
    capacity: 35,
    contactMethod: 'email',
    priority: ['concept', 'build', 'launch'],
    aliases: ['Ada Lovelace'],
    profile: {
      city: 'London',
      notes: 'Analytical engine notes'
    }
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
            testID='input-name'
          />
          <Input
            $value={$value.age}
            label='Age'
            type='number'
            description='Numeric value with spinner/input behavior'
            testID='input-age'
          />
          <Input
            $value={$value.subscribed}
            label='Subscribed'
            type='boolean'
            testID='input-subscribed'
          />
          <Input
            $value={$value.role}
            label='Role'
            type='select'
            options={['participant', 'organizer', 'guest']}
            testID='input-role'
          />
          <Input
            $value={$value.password}
            label='Password'
            type='password'
            testID='input-password'
          />
          <Input
            $value={$value.startDate}
            label='Start date'
            type='date'
            testID='input-start-date'
          />
          <Input
            $value={$value.startTime}
            label='Start time'
            type='time'
            testID='input-start-time'
          />
          <Input
            $value={$value.startDatetime}
            label='Start datetime'
            type='datetime'
            testID='input-start-datetime'
          />
          <Input
            $value={$value.people}
            label='People'
            type='multiselect'
            options={[
              { value: 'ada', label: 'Ada Lovelace' },
              { value: 'grace', label: 'Grace Hopper' },
              { value: 'hedy', label: 'Hedy Lamarr' }
            ]}
            testID='input-people'
          />
          <Input
            $value={$value.color}
            label='Favorite color'
            type='color'
            testID='input-color'
          />
          <Input
            $value={$value.capacity}
            label='Capacity'
            type='range'
            min={0}
            max={100}
            step={5}
            testID='input-capacity'
          />
          <Input
            $value={$value.contactMethod}
            label='Contact method'
            type='radio'
            options={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' }
            ]}
            testID='input-contact-method'
          />
          <Input
            $value={$value.priority}
            label='Priority order'
            type='rank'
            options={[
              { value: 'concept', label: 'Concept' },
              { value: 'build', label: 'Build' },
              { value: 'launch', label: 'Launch' }
            ]}
            testID='input-priority'
          />
          <Input
            $value={$value.aliases}
            label='Aliases'
            type='array'
            items={{
              type: 'string',
              label: 'Alias'
            }}
            testID='input-aliases'
          />
          <Input
            $value={$value.profile}
            label='Profile'
            type='object'
            properties={{
              city: {
                type: 'string',
                label: 'Profile city'
              },
              notes: {
                type: 'string',
                label: 'Profile notes'
              }
            }}
            testID='input-profile'
          />
          <Input
            $value={$value.name}
            label='Error name'
            description='The wrapper should expose both description and error semantics.'
            type='text'
            error='This field is required'
            placeholder='Person name'
            testID='input-error-name'
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
  await expect(canvas.getByLabelText('File upload')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <InputStates />,
  play: async ({ canvas, userEvent }) => {
    const nameField = canvas.getByLabelText('Name')
    const nameWithErrorField = canvas.getByLabelText('Error name')
    const labelledInputs = [
      ['Age', 'input-age'],
      ['Subscribed', 'input-subscribed'],
      ['Role', 'input-role'],
      ['Password', 'input-password'],
      ['Start date', 'input-start-date'],
      ['Start time', 'input-start-time'],
      ['Start datetime', 'input-start-datetime'],
      ['People', 'input-people'],
      ['Favorite color', 'input-color'],
      ['Capacity', 'input-capacity'],
      ['Priority order', 'input-priority'],
      ['Aliases', 'input-aliases'],
      ['Profile', 'input-profile']
    ] as const

    await expect(nameField).toBeVisible()
    await expect(nameWithErrorField).toBeVisible()
    await expect(canvas.getByTestId('input-name')).toBeVisible()
    await expect(canvas.getByTestId('input-error-name')).toBeVisible()

    for (const [label, testID] of labelledInputs) {
      const labelledTarget = await waitFor(() => canvas.getByLabelText(label))
      await expect(labelledTarget).toBeInTheDocument()
      if (label !== 'Role') await expect(labelledTarget).toBeVisible()
      await expect(canvas.getByTestId(testID)).toBeVisible()
    }

    await expect(canvas.getByRole('radiogroup', { name: 'Contact method' })).toBeVisible()
    await expect(canvas.getByTestId('input-contact-method')).toBeVisible()

    await userEvent.clear(nameField)
    await userEvent.type(nameField, 'Grace Hopper')

    await expect(nameField).toHaveValue('Grace Hopper')
    await expect(nameWithErrorField).toHaveAttribute('aria-invalid', 'true')
  }
}
