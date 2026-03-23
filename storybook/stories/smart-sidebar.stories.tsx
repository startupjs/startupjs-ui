import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { $, observer } from 'startupjs'
import { Button, Card, Div, SmartSidebar, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const SmartSidebarDemo = observer(function SmartSidebarDemo ({
  title,
  breakpoint,
  defaultOpen
}: {
  title: string
  breakpoint: number
  defaultOpen: boolean
}) {
  const $open = $(false)

  return (
    <StorySection
      title={title}
      description='One example uses the fixed sidebar branch and the other forces the drawer branch so both paths are visible in web Storybook.'
    >
      <Div gap={2} style={{ minHeight: 360 }}>
        <Div row gap={1}>
          <Button onPress={() => { $open.set(true) }}>
            Open
          </Button>
          <Button onPress={() => { $open.set(false) }}>
            Close
          </Button>
        </Div>
        <SmartSidebar
          $open={$open}
          fixedLayoutBreakpoint={breakpoint}
          defaultOpen={defaultOpen}
          width={260}
          renderContent={() => (
            <Div gap={1.5} style={{ padding: 16 }}>
              <Span h4>{title} navigation</Span>
              <Card style={{ padding: 12 }}>
                <Span bold>Dashboard</Span>
              </Card>
              <Card style={{ padding: 12 }}>
                <Span bold>Participants</Span>
              </Card>
            </Div>
          )}
        >
          <Card style={{ padding: 20 }}>
            <Div gap={0.75}>
              <Span h4>{title} workspace</Span>
              <Span description>
                The active branch is determined by `fixedLayoutBreakpoint` and the current viewport width.
              </Span>
            </Div>
          </Card>
        </SmartSidebar>
      </Div>
    </StorySection>
  )
})

const SmartSidebarStates = observer(function SmartSidebarStates () {
  return (
    <StoryStack>
      <SmartSidebarDemo title='Fixed layout branch' breakpoint={1} defaultOpen />
      <SmartSidebarDemo title='Drawer branch' breakpoint={99999} defaultOpen={false} />
    </StoryStack>
  )
})

const meta = {
  title: 'Navigation/SmartSidebar',
  component: SmartSidebarStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof SmartSidebarStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('navigation', { name: 'Fixed layout branch navigation' })).toBeVisible()
  await expect(canvas.getByRole('dialog')).toBeVisible()
}
void failingFollowup

export const Branches: Story = {
  tags: ['interaction'],
  render: () => <SmartSidebarStates />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fixed layout branch navigation')).toBeVisible()
    await expect(canvas.getByText('Fixed layout branch workspace')).toBeVisible()
    await expect(canvas.getByText('Drawer branch workspace')).toBeVisible()

    const closeButtons = canvas.getAllByRole('button', { name: 'Close' })
    const openButtons = canvas.getAllByRole('button', { name: 'Open' })

    await userEvent.click(closeButtons[0])
    await expect(canvas.getByText('Fixed layout branch navigation')).not.toBeVisible()

    await userEvent.click(openButtons[0])
    await expect(canvas.getByText('Fixed layout branch navigation')).toBeVisible()

    await expect(canvas.getByText('Drawer branch navigation')).toBeVisible()
    await userEvent.click(openButtons[1])
    await expect(canvas.getByText('Drawer branch navigation')).toBeVisible()
  }
}
