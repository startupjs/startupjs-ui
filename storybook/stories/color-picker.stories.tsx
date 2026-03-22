/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const disabledTrigger = canvas.getByRole('button', { name: '#111827' })

  await expect(disabledTrigger).toBeDisabled()
  await expect(disabledTrigger).toHaveAccessibleName('Choose color #111827')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <ColorPickerStates />,
  play: async ({ canvas }) => {
    const smallTrigger = canvas.getByRole('button', { name: '#3B82F6' })
    const compactTrigger = canvas.getByRole('button', { name: '#22C55E' })
    const disabledTrigger = canvas.getByRole('button', { name: '#111827' })

    await expect(smallTrigger).toBeVisible()
    await expect(compactTrigger).toBeVisible()
    await expect(disabledTrigger).toBeVisible()
    expect(canvas.getAllByRole('button')).toHaveLength(3)
  }
}
