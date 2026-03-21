import type { Meta, StoryObj } from '@storybook/react-native'
import { Icon } from 'startupjs-ui'
import { faCircleInfo, faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Display/Icon',
  component: Icon
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Sizes'>
        <InlineRow>
          <Icon icon={faHeart} size='xs' />
          <Icon icon={faHeart} size='s' />
          <Icon icon={faHeart} size='m' />
          <Icon icon={faHeart} size='l' />
          <Icon icon={faHeart} size='xl' />
          <Icon icon={faHeart} size='xxl' />
        </InlineRow>
      </StorySection>

      <StorySection title='Different glyphs'>
        <InlineRow>
          <Icon icon={faSearch} size='l' />
          <Icon icon={faCircleInfo} size='l' />
          <Icon icon={faTrash} size='l' />
        </InlineRow>
      </StorySection>
    </StoryStack>
  )
}
