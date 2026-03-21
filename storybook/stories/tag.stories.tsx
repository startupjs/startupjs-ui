import type { Meta, StoryObj } from '@storybook/react-native'
import { Tag, Span } from 'startupjs-ui'
import { faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Display/Tag',
  component: Tag
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Variants'>
        <InlineRow>
          <Tag color='primary'>Flat</Tag>
          <Tag color='primary' variant='outlined'>
            Outlined
          </Tag>
          <Tag color='primary' variant='outlined-bg'>
            Outlined background
          </Tag>
        </InlineRow>
      </StorySection>

      <StorySection title='Interactive icons'>
        <InlineRow>
          <Tag icon={faHeart} secondaryIcon={faTrash} onPress={() => {}}>
            Favorite
          </Tag>
          <Tag icon={faSearch} onIconPress={() => {}} onSecondaryIconPress={() => {}}>
            Searchable
          </Tag>
        </InlineRow>
      </StorySection>

      <Span description>Tag presses should be targetable by role on web after the UI patch.</Span>
    </StoryStack>
  )
}
