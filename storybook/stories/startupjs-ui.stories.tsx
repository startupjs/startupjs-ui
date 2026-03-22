import type { Meta, StoryObj } from '@storybook/react-native'
import { expect } from 'storybook/test'
import { Avatar, Badge, Button, Card, Div, Loader, Progress, Span, Tag } from 'startupjs-ui'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'System/Startupjs UI',
  component: Div
} satisfies Meta<typeof Div>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  tags: ['interaction'],
  render: () => (
    <StoryStack>
      <StorySection title='Re-export smoke test'>
        <StoryStack>
          <InlineRow>
            <Button onPress={() => {}}>Button</Button>
            <Tag icon={faHeart} onPress={() => {}}>Tag</Tag>
            <Badge label={4}>
              <Span>Badge</Span>
            </Badge>
            <Loader />
            <Progress value={45}>Progress</Progress>
          </InlineRow>
          <InlineRow>
            <Avatar>Startup JS</Avatar>
            <Card style={{ padding: 16, minWidth: 160 }}>
              <Span bold>Card</Span>
            </Card>
            <Div gap={0.5} style={{ padding: 12, borderRadius: 12, backgroundColor: '#f3f4f6' }}>
              <Span description>Core components are available from the top-level package.</Span>
              <Span description>Storybook keeps the package wiring honest.</Span>
            </Div>
          </InlineRow>
        </StoryStack>
      </StorySection>

      <StorySection title='Helper text'>
        <Span description>
          This story is intentionally small. The component-specific stories carry the detailed coverage.
        </Span>
      </StorySection>
    </StoryStack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Button' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Tag' })).toBeVisible()
    await expect(canvas.getByText('Card')).toBeVisible()
    await expect(canvas.getByText('Core components are available from the top-level package.')).toBeVisible()
  }
}
