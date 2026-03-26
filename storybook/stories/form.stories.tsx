/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent, within } from 'storybook/test'
import { $, observer } from 'startupjs'
import { Form, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const FormStates = observer(function FormStates () {
  const $value = $({
    name: '',
    age: 27,
    role: 'participant',
    agreed: true,
    notes: 'Mostly interested in interface testing'
  })

  const fields = {
    name: {
      type: 'string',
      label: 'Full name',
      placeholder: 'Ada Lovelace',
      required: true
    },
    age: {
      type: 'number',
      label: 'Age',
      min: 18,
      max: 99
    },
    role: {
      type: 'string',
      label: 'Role',
      enum: ['participant', 'organizer', 'guest']
    },
    agreed: {
      type: 'boolean',
      label: 'Agree to the rules'
    },
    notes: {
      type: 'string',
      label: 'Notes',
      description: 'Shown to demonstrate longer text and rows layout.',
      input: 'text'
    }
  }

  return (
    <StoryStack>
      <StorySection
        title='Validation form'
        description='Empty required fields should surface errors immediately.'
      >
        <Form
          $value={$value}
          fields={fields}
          validate
        />
        <Span>{`Form snapshot: ${JSON.stringify($value.get())}`}</Span>
      </StorySection>
      <Span description>
        This story exercises the form wrapper, label semantics, and nested input composition.
      </Span>
    </StoryStack>
  )
})

const meta = {
  title: 'Inputs/Form',
  component: FormStates
} satisfies Meta<typeof FormStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByLabelText('Age')).toBeVisible()
  await expect(canvas.getByText(/Full name.*required/i)).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <FormStates />,
  play: async ({ canvas }) => {
    const nameInput = canvas.getByLabelText('Full name')
    const roleSelect = canvas.getByLabelText('Role')
    const agreedCheckbox = canvas.getByRole('checkbox', { name: 'Agree to the rules' })

    await userEvent.type(nameInput, 'Ada Lovelace')
    await userEvent.selectOptions(roleSelect, within(roleSelect).getByRole('option', { name: 'organizer' }))
    await userEvent.click(agreedCheckbox)

    await expect(canvas.getByText(/"name":"Ada Lovelace"/)).toBeVisible()
    await expect(canvas.getByText(/"role":"organizer"/)).toBeVisible()
    await expect(canvas.getByText(/"agreed":false/)).toBeVisible()
  }
}
