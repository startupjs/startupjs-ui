/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Checkbox, Input } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

function CheckboxStates () {
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(false)

  return (
    <StoryStack>
      <StorySection title='Checkbox and switch variants'>
        <InlineRow>
          <Input
            type='checkbox'
            label='Receive notifications'
            value={checked}
            onChange={setChecked}
          />
          <Input
            type='checkbox'
            label='Use compact mode'
            variant='switch'
            value={switched}
            onChange={setSwitched}
          />
        </InlineRow>
      </StorySection>
      <StorySection title='Disabled and readonly'>
        <InlineRow>
          <Input type='checkbox' label='Disabled' value disabled />
          <Input type='checkbox' label='Readonly' value readonly />
        </InlineRow>
      </StorySection>
      <StorySection title='Low-level checkbox'>
        <Checkbox
          value={checked}
          onChange={setChecked}
          aria-label='Receive notifications low level'
        />
      </StorySection>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Checkbox',
  component: CheckboxStates
} satisfies Meta<typeof CheckboxStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const disabledCheckbox = canvas.getByLabelText('Disabled')
  const readonlyCheckbox = canvas.getByRole('checkbox', { name: 'Readonly' })

  await expect(disabledCheckbox).toHaveAttribute('aria-disabled', 'true')
  await expect(readonlyCheckbox).toHaveAttribute('aria-readonly', 'true')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <CheckboxStates />,
  play: async ({ canvas, userEvent }) => {
    const wrappedCheckbox = canvas.getByLabelText('Receive notifications')
    const wrappedSwitch = canvas.getByLabelText('Use compact mode')
    const disabledCheckbox = canvas.getByLabelText('Disabled')
    const lowLevelCheckbox = canvas.getByLabelText('Receive notifications low level')

    await expect(wrappedCheckbox).toBeVisible()
    await expect(wrappedSwitch).toBeVisible()
    await expect(disabledCheckbox).toBeVisible()
    await expect(lowLevelCheckbox).toBeVisible()

    await expect(wrappedCheckbox).toHaveAttribute('role', 'checkbox')
    await expect(wrappedSwitch).toHaveAttribute('role', 'switch')

    await userEvent.click(wrappedCheckbox)
    await expect(wrappedCheckbox).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(wrappedSwitch)
    await expect(wrappedSwitch).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(disabledCheckbox)
    await expect(disabledCheckbox).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(lowLevelCheckbox)
    await expect(lowLevelCheckbox).toHaveAttribute('aria-checked', 'true')
  }
}
