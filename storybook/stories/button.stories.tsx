/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Button } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Actions/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: args => (
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
        </InlineRow>
      </StorySection>
      <StorySection title='Disabled and async states'>
        <InlineRow>
          <Button {...args} disabled>Save</Button>
          <Button
            {...args}
            onPress={async () => {
              await new Promise(resolve => setTimeout(resolve, 1200))
            }}
          >Async save</Button>
          <Button
            {...args}
            onPress={async () => {
              await new Promise(resolve => setTimeout(resolve, 700))
              throw Error('Story rejection')
            }}
          >Async reject</Button>
        </InlineRow>
      </StorySection>
    </StoryStack>
  )
}
