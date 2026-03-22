import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Tag, Span } from 'startupjs-ui'
import { faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Display/Tag',
  component: Tag
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Search icon' })).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Remove Favorite' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
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
  ),
  play: async ({ canvas }) => {
    const favoriteTag = canvas.getByRole('button', { name: 'Favorite' })

    await expect(favoriteTag).toBeVisible()
    await expect(canvas.getByText('Searchable')).toBeVisible()
    expect(canvas.getAllByRole('button').length).toBeGreaterThanOrEqual(1)
  }
}
