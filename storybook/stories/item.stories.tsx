import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Div, Item, Span } from 'startupjs-ui'
import { faCircleInfo, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons'
import { StorySection, StoryStack } from './helpers'

const ITEM_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#0f172a"/><text x="48" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">AL</text></svg>'
  )

const meta = {
  title: 'Data/Item',
  component: Item,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof Item>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Custom left Custom content block Right slot' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection
        title='Interactive rows'
        description='Item can behave like a linked row or a pressable row while still exposing its content slots.'
      >
        <Div gap={1}>
          <Item to='/people/ada' icon={faCircleInfo}>
            Open participant details
          </Item>
          <Item onPress={() => {}} icon={faHeart} url={ITEM_IMAGE}>
            With image fallback
          </Item>
          <Item
            onPress={() => {}}
            icon={faHeart}
            aria-label='Select Ada Lovelace'
          >
            Ada Lovelace
          </Item>
          <Item icon={faSearch} onPress={() => {}}>
            <Item.Left>
              <Span bold>Custom left</Span>
            </Item.Left>
            <Item.Content>
              <Span>Custom content block</Span>
            </Item.Content>
            <Item.Right>
              <Span description>Right slot</Span>
            </Item.Right>
          </Item>
        </Div>
      </StorySection>

      <Div gap={0.5}>
        <Span description>These examples exercise link-like and pressable row semantics without depending on router state.</Span>
      </Div>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    const detailsLink = canvas.getByRole('link', { name: 'Open participant details' })
    const imageFallbackItem = canvas.getByRole('button', { name: 'With image fallback' })
    const selectableItem = canvas.getByRole('button', { name: 'Select Ada Lovelace' })
    const customSlotItem = canvas.getByRole('button', { name: 'Custom left Custom content block Right slot' })

    await expect(detailsLink).toBeVisible()
    await expect(imageFallbackItem).toBeVisible()
    await expect(selectableItem).toBeVisible()
    await expect(customSlotItem).toBeVisible()
    expect(detailsLink.tagName).toBe('A')
    expect(detailsLink.getAttribute('href')).toContain('/people/ada')
    expect(imageFallbackItem.tagName).toBe('DIV')
    expect(selectableItem.tagName).toBe('DIV')
    expect(customSlotItem.tagName).toBe('DIV')
  }
}
