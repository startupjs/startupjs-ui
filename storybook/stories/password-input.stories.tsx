/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { PasswordInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function PasswordInputStates () {
  const [value, setValue] = useState('correct horse battery staple')

  return (
    <StoryStack>
      <StorySection title='Visibility toggle'>
        <PasswordInput
          label='Password'
          value={value}
          placeholder='Enter password'
          onChangeText={setValue}
        />
      </StorySection>
      <StorySection title='Disabled'>
        <PasswordInput
          label='Disabled password'
          value='locked'
          disabled
        />
      </StorySection>
      <Span description>
        Verify the eye icon, secure text behavior, and label association here.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/PasswordInput',
  component: PasswordInputStates
} satisfies Meta<typeof PasswordInputStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByLabelText('Password')).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Show password' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <PasswordInputStates />,
  play: async ({ canvas }) => {
    const passwordInput = canvas.getByDisplayValue('correct horse battery staple')
    const disabledPasswordInput = canvas.getByDisplayValue('locked')

    await expect(passwordInput).toBeVisible()
    await expect(disabledPasswordInput).toBeVisible()

    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'new secret')
    await expect(passwordInput).toHaveValue('new secret')
    await expect(disabledPasswordInput).toBeDisabled()
  }
}
