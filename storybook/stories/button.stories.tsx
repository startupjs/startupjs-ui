/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent, waitFor } from 'storybook/test'
import { Button, Div, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Actions/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  const asyncSaveButton = canvas.getByRole('button', { name: 'Async save' })

  await expect(asyncSaveButton).toHaveAttribute('aria-busy', 'true')
}
void failingFollowup

function ButtonStatesStory (args: Record<string, any>) {
  const [disabledRuns, setDisabledRuns] = useState(0)
  const [asyncSaveRuns, setAsyncSaveRuns] = useState(0)
  const [asyncRejectRuns, setAsyncRejectRuns] = useState(0)

  return (
    <StoryStack>
      <StorySection title='Variants'>
        <InlineRow>
          <Button {...args} variant='flat'>Save</Button>
          <Button {...args} variant='outlined'>Save</Button>
          <Button {...args} variant='text'>Save</Button>
        </InlineRow>
      </StorySection>
      <StorySection title='Sizes and icons'>
        <InlineRow>
          <Button {...args} size='s' icon={faHeart}>Save</Button>
          <Button {...args} size='m' icon={faHeart}>Save</Button>
          <Button {...args} size='l' icon={faHeart}>Save</Button>
          <Button {...args} icon={faTrash} iconPosition='right'>Delete</Button>
          <Button {...args} icon={faTrash} aria-label='Delete participant' onPress={() => {}} />
        </InlineRow>
      </StorySection>
      <StorySection title='Disabled and async states'>
        <Div gap={1}>
          <InlineRow>
            <Button {...args} disabled onPress={() => setDisabledRuns(count => count + 1)}>Disabled save</Button>
            <Button
              {...args}
              onPress={async () => {
                setAsyncSaveRuns(count => count + 1)
                await new Promise(resolve => setTimeout(resolve, 150))
              }}
            >Async save</Button>
            <Button
              {...args}
              onPress={() => {
                setAsyncRejectRuns(count => count + 1)
                const promise = new Promise<void>((resolve, reject) => {
                  setTimeout(() => reject(Error('Story rejection')), 100)
                })
                promise.catch(() => {})
                return promise
              }}
            >Async reject</Button>
          </InlineRow>
          <Div gap={0.5}>
            <Span>Disabled runs: {disabledRuns}</Span>
            <Span>Async save runs: {asyncSaveRuns}</Span>
            <Span>Async reject runs: {asyncRejectRuns}</Span>
          </Div>
        </Div>
      </StorySection>
    </StoryStack>
  )
}

export const States: Story = {
  tags: ['interaction'],
  render: args => <ButtonStatesStory {...args} />,
  play: async ({ canvas }) => {
    const iconOnlyButton = canvas.getByRole('button', { name: 'Delete participant' })
    const disabledButton = canvas.getByRole('button', { name: 'Disabled save' })
    const asyncSaveButton = canvas.getByRole('button', { name: 'Async save' })
    const asyncRejectButton = canvas.getByRole('button', { name: 'Async reject' })

    await expect(iconOnlyButton).toBeVisible()
    await expect(disabledButton).toBeVisible()
    expect(iconOnlyButton.tagName).toBe('BUTTON')
    expect(iconOnlyButton.getAttribute('type')).toBe('button')
    expect(asyncSaveButton.tagName).toBe('BUTTON')
    expect(asyncSaveButton.getAttribute('type')).toBe('button')
    await expect(disabledButton).toBeDisabled()

    await userEvent.click(disabledButton)
    await expect(canvas.getByText('Disabled runs: 0')).toBeVisible()

    await userEvent.click(asyncSaveButton)
    await userEvent.click(asyncSaveButton)
    await waitFor(() => expect(canvas.getByText('Async save runs: 1')).toBeVisible())
    await expect(asyncRejectButton).toBeVisible()
    await expect(canvas.getByText('Async reject runs: 0')).toBeVisible()
  }
}
