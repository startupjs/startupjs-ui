import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { $ } from 'startupjs'
import { Button, Card, Div, Span, Tabs } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const ROUTES = [
  { key: 'overview', title: 'Overview' },
  { key: 'matches', title: 'Matches' },
  { key: 'notes', title: 'Notes' }
]

function TabsStates () {
  const [$value] = useState(() => $('overview'))
  const [$bottomValue] = useState(() => $('matches'))

  function renderScene ({ route }: { route: { key: string } }) {
    switch (route.key) {
      case 'overview':
        return (
          <Card style={{ padding: 16 }}>
            <Div gap={0.5}>
              <Span bold>Overview</Span>
              <Span description>Summarize the event state, stage, and participant count.</Span>
            </Div>
          </Card>
        )
      case 'matches':
        return (
          <Card style={{ padding: 16 }}>
            <Div gap={0.5}>
              <Span bold>Matches</Span>
              <Span description>Show mutual matches and one-sided likes.</Span>
            </Div>
          </Card>
        )
      case 'notes':
        return (
          <Card style={{ padding: 16 }}>
            <Div gap={0.5}>
              <Span bold>Notes</Span>
              <Span description>Keep organizer comments and follow-up actions here.</Span>
            </Div>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <StoryStack>
      <StorySection
        title='Top tabs'
        description='This is the standard controlled tab view. The active tab state stays in React so the selected route is visible in the story.'
      >
        <Tabs
          routes={ROUTES}
          $value={$value}
          renderScene={renderScene as any}
        />
      </StorySection>
      <StorySection
        title='Bottom tabs'
        description='The same routes are also exercised with the tab bar moved to the bottom.'
      >
        <Tabs
          routes={ROUTES}
          $value={$bottomValue}
          renderScene={renderScene as any}
          tabBarPosition='bottom'
        />
      </StorySection>
      <Button onPress={() => { $value.set('overview') }}>
        Reset to overview
      </Button>
    </StoryStack>
  )
}

const meta = {
  title: 'Navigation/Tabs',
  component: TabsStates,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof TabsStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <TabsStates />
}
