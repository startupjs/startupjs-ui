/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
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

export const States: Story = {
  render: () => <PasswordInputStates />
}
