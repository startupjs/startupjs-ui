/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Checkbox } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

function CheckboxStates () {
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(false)

  return (
    <StoryStack>
      <StorySection title='Checkbox and switch variants'>
        <InlineRow>
          <Checkbox
            label='Receive notifications'
            value={checked}
            onChange={setChecked}
          />
          <Checkbox
            label='Use compact mode'
            variant='switch'
            value={switched}
            onChange={setSwitched}
          />
        </InlineRow>
      </StorySection>
      <StorySection title='Disabled and readonly'>
        <InlineRow>
          <Checkbox label='Disabled' value disabled />
          <Checkbox label='Readonly' value readonly />
        </InlineRow>
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
  render: () => <CheckboxStates />
}
