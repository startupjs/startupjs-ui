import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, Collapse, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function CollapseStates () {
  const [open, setOpen] = useState(true)

  return (
    <StoryStack>
      <StorySection
        title='Default collapse'
        description='Click the header to toggle the body. This example is controlled so the open state is obvious on first load.'
      >
        <Collapse title='Event rules' open={open} onChange={setOpen}>
          <Div gap={0.5}>
            <Span>Participants must stay within the assigned timebox.</Span>
            <Span description>Mutual matches unlock contact details in the results view.</Span>
          </Div>
        </Collapse>
      </StorySection>
      <StorySection
        title='Custom composition'
        description='Header and content can be split into explicit subcomponents when the default title/body layout is not enough.'
      >
        <Collapse variant='pure' icon={false} open>
          <Collapse.Header>Notes for organizers</Collapse.Header>
          <Collapse.Content>
            <Div gap={0.5}>
              <Span>Use the dashboard to advance the event stage.</Span>
              <Span description>Participants without a number stay blocked in Waiting.</Span>
            </Div>
          </Collapse.Content>
        </Collapse>
      </StorySection>
      <Button onPress={() => { setOpen(true) }}>
        Reset first example
      </Button>
    </StoryStack>
  )
}

const meta = {
  title: 'Feedback/Collapse',
  component: CollapseStates,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof CollapseStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <CollapseStates />
}
