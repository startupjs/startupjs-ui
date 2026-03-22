import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Icon } from 'startupjs-ui'
import { faCircleInfo, faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Display/Icon',
  component: Icon
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvasElement }: PlayContext) {
  expect(canvasElement.querySelectorAll('svg[aria-hidden="true"]').length).toBeGreaterThan(0)
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
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
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Sizes', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Different glyphs', { exact: true })).toBeVisible()
    expect(canvas.queryByRole('button')).toBeNull()
    expect(canvasElement.querySelectorAll('svg').length).toBeGreaterThanOrEqual(9)
  }
}
