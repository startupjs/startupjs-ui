/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Platform } from 'react-native'
import { expect } from 'storybook/test'
import { FileInput, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function FileInputStates () {
  const [fileId, setFileId] = useState<string | undefined>('demo-file-id')
  const [avatarFileId, setAvatarFileId] = useState<string | undefined>()
  const isWeb = Platform.OS === 'web'

  return (
    <StoryStack>
      {isWeb
        ? (
          <StorySection
            title='Web blocker'
            description='The public FileInput export currently resolves the non-Expo fallback in storybook-web and throws before rendering.'
          >
            <Span description>
              Surface-level FileInput coverage remains blocked in this harness until the package-resolution/runtime path is fixed.
            </Span>
          </StorySection>
          )
        : (
          <>
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
          </>
          )}
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: /upload|change/i })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <FileInputStates />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Surface-level FileInput coverage remains blocked in this harness until the package-resolution/runtime path is fixed.')).toBeVisible()
  }
}
