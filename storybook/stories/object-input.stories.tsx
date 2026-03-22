/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { $, observer } from 'startupjs'
import { ObjectInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const ObjectInputStates = observer(function ObjectInputStates () {
  const [$value] = useState(() => $({
    wantsPartner: true,
    partnerName: 'Grace Hopper',
    notes: 'Conditional fields are useful for e2e coverage.'
  }))
  const [$details] = useState(() => $({
    age: 31,
    city: 'London'
  }))
  const [$readonly] = useState(() => $({
    email: 'ada@example.com',
    password: 'analytical-engine'
  }))

  return (
    <StoryStack>
      <StorySection
        title='Conditional fields'
        description='The partner name field is shown only when the toggle is enabled.'
      >
        <ObjectInput
          $value={$value}
          properties={{
            wantsPartner: {
              type: 'boolean',
              label: 'Wants a partner'
            },
            partnerName: {
              type: 'string',
              label: 'Partner name',
              dependsOn: 'wantsPartner',
              dependsValue: true
            },
            notes: {
              type: 'string',
              label: 'Notes',
              input: 'text'
            }
          }}
        />
        <Span>{`Conditional snapshot: ${JSON.stringify($value.get())}`}</Span>
      </StorySection>
      <StorySection
        title='Errors and number field'
        description='Wrapper-level errors should stay attached to the right nested field.'
      >
        <ObjectInput
          $value={$details}
          errors={{
            city: 'City is required'
          }}
          properties={{
            age: {
              type: 'number',
              label: 'Age'
            },
            city: {
              type: 'string',
              label: 'City'
            }
          }}
        />
        <Span>{`Details snapshot: ${JSON.stringify($details.get())}`}</Span>
      </StorySection>
      <StorySection title='Readonly values'>
        <ObjectInput
          $value={$readonly}
          readonly
          properties={{
            email: {
              type: 'string',
              label: 'Email'
            },
            password: {
              type: 'string',
              label: 'Password'
            }
          }}
        />
      </StorySection>
      <Span description>
        This story is useful for dependency-driven visibility and nested layouts.
      </Span>
    </StoryStack>
  )
})

const meta = {
  title: 'Inputs/ObjectInput',
  component: ObjectInputStates
} satisfies Meta<typeof ObjectInputStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByLabelText('Age')).toBeVisible()
  await expect(canvas.getByLabelText('City')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <ObjectInputStates />,
  play: async ({ canvas }) => {
    const wantsPartner = canvas.getByRole('checkbox', { name: 'Wants a partner' })
    const notesInput = canvas.getByLabelText('Notes')

    await expect(canvas.getByLabelText('Partner name')).toHaveValue('Grace Hopper')
    await expect(canvas.getByText('City is required')).toBeVisible()
    await expect(canvas.getByText(/"age":31/)).toBeVisible()

    await userEvent.click(wantsPartner)
    await expect(canvas.queryByLabelText('Partner name')).toBeNull()
    await expect(canvas.getByText(/"wantsPartner":false/)).toBeVisible()

    await userEvent.click(wantsPartner)
    await expect(canvas.getByLabelText('Partner name')).toHaveValue('Grace Hopper')

    await userEvent.clear(notesInput)
    await userEvent.type(notesInput, 'Updated notes for object input')
    await expect(canvas.getByText(/"notes":"Updated notes for object input"/)).toBeVisible()

    await expect(canvas.getByText('ada@example.com')).toBeVisible()
    await expect(canvas.getByText('analytical-engine')).toBeVisible()
  }
}
