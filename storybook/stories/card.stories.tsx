import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { Card, Div, Span } from 'startupjs-ui'
import { InlineRow, StorySection, StoryStack } from './helpers'

const meta = {
  title: 'Layout/Card',
  component: Card
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Cards can be used as tappable surfaces.' })).toBeVisible()
}
void failingFollowup

function CardStates () {
  const [disabledRuns, setDisabledRuns] = useState(0)

  return (
    <StoryStack>
      <StorySection title='Levels and variants'>
        <InlineRow>
          <Card data-testid='card-outlined' level={0} variant='outlined' style={{ padding: 16, minWidth: 160 }}>
            <Span bold>Outlined</Span>
          </Card>
          <Card data-testid='card-level-1' level={1} style={{ padding: 16, minWidth: 160 }}>
            <Span bold>Level 1</Span>
          </Card>
          <Card data-testid='card-level-4' level={4} style={{ padding: 16, minWidth: 160 }}>
            <Span bold>Level 4</Span>
          </Card>
        </InlineRow>
      </StorySection>

      <StorySection title='Pressable card'>
        <Card
          data-testid='card-pressable'
          level={2}
          aria-label='Open participant details'
          style={{ padding: 16 }}
          onPress={() => {}}
        >
          <Div gap={0.5}>
            <Span bold>Open participant details</Span>
            <Span description>Cards can be used as tappable surfaces.</Span>
          </Div>
        </Card>
      </StorySection>

      <StorySection title='Disabled pressable card'>
        <Card
          aria-label='Disabled participant details'
          style={{ padding: 16 }}
          disabled
          onPress={() => setDisabledRuns(count => count + 1)}
        >
          <Div gap={0.5}>
            <Span bold>Disabled participant details</Span>
            <Span description>Disabled cards should stay targetable as disabled controls.</Span>
          </Div>
        </Card>
        <Span>Disabled card runs: {disabledRuns}</Span>
      </StorySection>
    </StoryStack>
  )
}

export const States: Story = {
  tags: ['interaction'],
  render: () => <CardStates />,
  play: async ({ canvas }) => {
    const outlinedCard = canvas.getByTestId('card-outlined')
    const levelOneCard = canvas.getByTestId('card-level-1')
    const pressableCard = canvas.getByRole('button', { name: 'Open participant details' })
    const disabledCard = canvas.getByRole('button', { name: 'Disabled participant details' })

    await expect(outlinedCard).toBeVisible()
    await expect(levelOneCard).toBeVisible()
    await expect(pressableCard).toBeVisible()
    await expect(disabledCard).toHaveAttribute('aria-disabled', 'true')
    expect(outlinedCard.getAttribute('role')).toBeNull()
    expect(levelOneCard.getAttribute('role')).toBeNull()
    expect(pressableCard.tagName).toBe('DIV')
    expect(disabledCard.tagName).toBe('DIV')
    expect(canvas.getAllByRole('button')).toHaveLength(2)

    await userEvent.click(disabledCard)
    await expect(canvas.getByText('Disabled card runs: 0')).toBeVisible()
  }
}
