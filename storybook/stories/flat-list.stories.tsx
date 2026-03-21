import type { Meta, StoryObj } from '@storybook/react-native'
import { FlatList, Item } from 'startupjs-ui'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { StorySection, StoryStack } from './helpers'

const ITEMS = [
  { id: '1', title: 'Ada Lovelace', description: 'Analytical Engine notes' },
  { id: '2', title: 'Grace Hopper', description: 'Compiler pioneer' },
  { id: '3', title: 'Hedy Lamarr', description: 'Frequency hopping inventor' },
  { id: '4', title: 'Radia Perlman', description: 'Network protocols' }
]

const meta = {
  title: 'Lists/FlatList',
  component: FlatList,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof FlatList>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <StoryStack>
      <StorySection title='Scrollable list'>
        <FlatList
          style={{ height: 280 }}
          data={ITEMS}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => null}
          renderItem={({ item }) => (
            <Item icon={faCircleInfo}>
              {item.title}
            </Item>
          )}
        />
      </StorySection>
    </StoryStack>
  )
}
