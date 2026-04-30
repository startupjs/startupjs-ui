import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, waitFor } from 'storybook/test'
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
        <Div gap={0.5}>
          <Span>First example open: {String(open)}</Span>
        </Div>
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  const defaultHeader = canvas.getByRole('button', { name: 'Event rules' })

  await expect(defaultHeader).toHaveAttribute('aria-expanded', 'true')
  await userEvent.click(defaultHeader)
  await expect(defaultHeader).toHaveAttribute('aria-expanded', 'false')
  await expect(canvas.getByText('Participants must stay within the assigned timebox.')).not.toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <CollapseStates />,
  play: async ({ canvas, userEvent }) => {
    const defaultHeader = canvas.getByRole('button', { name: 'Event rules' })
    const resetButton = canvas.getByRole('button', { name: 'Reset first example' })
    const customHeader = canvas.getByRole('button', { name: 'Notes for organizers' })

    await expect(defaultHeader).toBeVisible()
    await expect(customHeader).toBeVisible()
    await expect(canvas.getByText('First example open: true')).toBeVisible()
    await expect(canvas.getByText('Participants must stay within the assigned timebox.')).toBeVisible()
    await expect(canvas.getByText('Use the dashboard to advance the event stage.')).toBeVisible()

    await userEvent.click(defaultHeader)
    await waitFor(() => expect(canvas.getByText('First example open: false')).toBeVisible())

    await userEvent.click(resetButton)
    await waitFor(() => expect(canvas.getByText('First example open: true')).toBeVisible())
  }
}
