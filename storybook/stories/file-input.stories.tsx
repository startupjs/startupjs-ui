/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { FileInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function FileInputStates () {
  const [fileId, setFileId] = useState<string | undefined>('demo-file-id')
  const [avatarFileId, setAvatarFileId] = useState<string | undefined>()

  return (
    <StoryStack>
      <StorySection
        title='Document picker'
        description='This is the plain Expo file picker flow.'
      >
        <FileInput
          value={fileId}
          onChange={setFileId}
        />
      </StorySection>
      <StorySection
        title='Image picker'
        description='Useful for avatar/photo flows where the file id is displayed elsewhere.'
      >
        <FileInput
          image
          value={avatarFileId}
          onChange={setAvatarFileId}
        />
      </StorySection>
      <Span description>
        The picker itself is platform-native, so this story mainly validates the shell and actions.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/FileInput',
  component: FileInputStates
} satisfies Meta<typeof FileInputStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <FileInputStates />
}
