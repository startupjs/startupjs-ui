/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, within } from 'storybook/test'
import { Input, Select, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'participant', label: 'Participant' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'guest', label: 'Guest' }
]

function SelectStates () {
  const [value, setValue] = useState<string | undefined>('organizer')
  const [typedValue, setTypedValue] = useState<any>('true')

  const TYPED_OPTIONS = [
    { value: 'true', label: 'String true' },
    { value: true, label: 'Boolean true' },
    { value: '1', label: 'String one' },
    { value: 1, label: 'Number one' }
  ]

  return (
    <StoryStack>
      <StorySection title='Basic select'>
        <Input
          type='select'
          label='Role'
          description='Wrapped select should be targetable by the visible label on web.'
          options={OPTIONS}
          value={value}
          testId='role-select'
          onChange={setValue}
        />
      </StorySection>
      <StorySection title='Empty and disabled'>
        <InlineRow>
          <Input
            type='select'
            label='Optional role'
            options={OPTIONS}
            emptyValueLabel='Choose a role'
            value={undefined}
            onChange={() => {}}
          />
          <Input
            type='select'
            label='Disabled role'
            options={OPTIONS}
            value='guest'
            testId='disabled-role-select'
            disabled
            onChange={() => {}}
          />
        </InlineRow>
      </StorySection>
      <StorySection title='Low-level select'>
        <Select
          options={OPTIONS}
          value={value}
          testID='low-level-role-select'
          onChange={setValue}
          aria-label='Role low level'
        />
      </StorySection>
      <StorySection title='Typed values stay distinct'>
        <Input
          type='select'
          label='Typed role'
          options={TYPED_OPTIONS}
          value={typedValue}
          onChange={setTypedValue}
        />
        <Span>{`Selected typed value: ${String(typedValue)} (${typeof typedValue})`}</Span>
      </StorySection>
      <Span description>
        This story is mainly about the wrapper semantics and the overlay option list on web.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Select',
  component: SelectStates
} satisfies Meta<typeof SelectStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByTestId('role-select-combobox')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <SelectStates />,
  play: async ({ canvas, userEvent }) => {
    const wrappedSelect = canvas.getByLabelText('Role')
    const optionalSelect = canvas.getByLabelText('Optional role')
    const lowLevelSelect = canvas.getByLabelText('Role low level')
    const lowLevelSelectByTestId = canvas.getByTestId('low-level-role-select-combobox')
    const disabledSelect = canvas.getByLabelText('Disabled role')
    const typedSelect = canvas.getByLabelText('Typed role')

    await expect(canvas.getByTestId('role-select-combobox')).toBe(wrappedSelect)
    await expect(lowLevelSelectByTestId).toBe(lowLevelSelect)
    await expect(disabledSelect).toBeDisabled()
    await expect(optionalSelect).toHaveDisplayValue('Choose a role')
    await expect(disabledSelect).toHaveDisplayValue('Guest')

    await userEvent.selectOptions(wrappedSelect, within(wrappedSelect).getByRole('option', { name: 'Guest' }))
    await expect(wrappedSelect).toHaveDisplayValue('Guest')

    await userEvent.selectOptions(lowLevelSelect, within(lowLevelSelect).getByRole('option', { name: 'Participant' }))
    await expect(lowLevelSelect).toHaveDisplayValue('Participant')

    await userEvent.selectOptions(typedSelect, within(typedSelect).getByRole('option', { name: 'Boolean true' }))
    await expect(canvas.getByText('Selected typed value: true (boolean)')).toBeVisible()

    await userEvent.selectOptions(typedSelect, within(typedSelect).getByRole('option', { name: 'String true' }))
    await expect(canvas.getByText('Selected typed value: true (string)')).toBeVisible()
  }
}
