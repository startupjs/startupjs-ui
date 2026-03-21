/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { ColorPicker, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

function ColorPickerStates () {
  const [primary, setPrimary] = useState('#3b82f6')
  const [accent, setAccent] = useState('#22c55e')

  return (
    <StoryStack>
      <StorySection title='Interactive buttons'>
        <InlineRow>
          <ColorPicker value={primary} onChangeColor={setPrimary} />
          <ColorPicker value={accent} size='s' onChangeColor={setAccent} />
          <ColorPicker value='#111827' size='l' disabled />
        </InlineRow>
      </StorySection>
      <Span description>
        Use this story to verify the button label and color preview remain readable.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/ColorPicker',
  component: ColorPickerStates
} satisfies Meta<typeof ColorPickerStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <ColorPickerStates />
}
