import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Icon } from 'startupjs-ui'
import { faCircleInfo, faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const CUSTOM_ICON_COLOR = '#16a34a'

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

function CustomContractIcon ({
  color,
  fill,
  width,
  height,
  style
}: {
  color?: string
  fill?: string
  width?: number
  height?: number
  style?: any
}) {
  return (
    <svg
      data-testid='custom-icon-contract'
      data-color={color}
      data-fill={fill}
      data-width={width}
      data-height={height}
      width={width}
      height={height}
      viewBox='0 0 32 32'
      style={style}
    >
      <circle cx='16' cy='16' r='14' fill='currentColor' />
    </svg>
  )
}

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

      <StorySection title='Custom icon contract'>
        <Icon icon={CustomContractIcon} size={32} style={{ color: CUSTOM_ICON_COLOR }} />
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Sizes', { exact: true })).toBeVisible()
    await expect(canvas.getByText('Different glyphs', { exact: true })).toBeVisible()
    expect(canvas.queryByRole('button')).toBeNull()
    expect(canvasElement.querySelectorAll('svg').length).toBeGreaterThanOrEqual(10)

    const customIcon = canvas.getByTestId('custom-icon-contract')
    expect(customIcon.getAttribute('data-color')).toBe(CUSTOM_ICON_COLOR)
    expect(customIcon.getAttribute('data-fill')).toBe(CUSTOM_ICON_COLOR)
    expect(customIcon.getAttribute('data-width')).toBe('32')
    expect(customIcon.getAttribute('data-height')).toBe('32')
  }
}
