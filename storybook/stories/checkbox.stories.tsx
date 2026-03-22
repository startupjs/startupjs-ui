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

export const States: Story = {
  tags: ['interaction'],
  render: () => <CheckboxStates />,
  play: async ({ canvas, userEvent }) => {
    const wrappedCheckbox = canvas.getByLabelText('Receive notifications')
    const lowLevelCheckbox = canvas.getByLabelText('Receive notifications low level')

    await expect(wrappedCheckbox).toBeVisible()
    await expect(lowLevelCheckbox).toBeVisible()

    await userEvent.click(wrappedCheckbox)
    await expect(wrappedCheckbox).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(lowLevelCheckbox)
    await expect(lowLevelCheckbox).toHaveAttribute('aria-checked', 'true')
  }
}
