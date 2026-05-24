import type { Meta, StoryObj } from '@storybook/react-native'
import { $, observer } from 'startupjs'
import { expect, screen, waitFor } from 'storybook/test'
import { Button, Card, Div, DrawerSidebar, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const DrawerSidebarStates = observer(function DrawerSidebarStates () {
  const $open = $(false)

  return (
    <StoryStack>
      <StorySection
        title='Drawer sidebar'
        description='The navigation panel is rendered by the drawer layout on web. This is the branch used for mobile-sized screens.'
      >
        <Div gap={2} style={{ minHeight: 380 }}>
          <Div row gap={1}>
            <Button onPress={() => { $open.set(true) }}>
              Open sidebar
            </Button>
            <Button onPress={() => { $open.set(false) }}>
              Close sidebar
            </Button>
          </Div>
          <DrawerSidebar
            $open={$open}
            width={280}
            testID='drawer-sidebar-panel'
            renderContent={() => (
              <Div gap={1.5} style={{ padding: 16 }}>
                <Span h4>Organizer menu</Span>
                <Span description>Start, progress, and results routes all live here.</Span>
                <Card style={{ padding: 12 }}>
                  <Div gap={0.5}>
                    <Span bold>Dashboard</Span>
                    <Span description>Stage controls and event summary.</Span>
                  </Div>
                </Card>
                <Card style={{ padding: 12 }}>
                  <Div gap={0.5}>
                    <Span bold>Participants</Span>
                    <Span description>Men and women tabs stay in sync with the event.</Span>
                  </Div>
                </Card>
              </Div>
            )}
          >
            <Card style={{ padding: 20 }}>
              <Div gap={0.75}>
                <Span h4>Workspace</Span>
                <Span description>
                  The main view keeps working while the drawer is open. Close it from the overlay or the button above.
                </Span>
              </Div>
            </Card>
          </DrawerSidebar>
          <Span>Sidebar open: {String($open.get())}</Span>
        </Div>
      </StorySection>
    </StoryStack>
  )
})

const meta = {
  title: 'Navigation/DrawerSidebar',
  component: DrawerSidebarStates,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof DrawerSidebarStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  await userEvent.click(canvas.getByRole('button', { name: 'Open sidebar' }))
  await waitFor(() => expect(screen.getByRole('navigation', { name: 'Organizer menu' })).toBeVisible())
}
void failingFollowup

export const MobileDrawer: Story = {
  tags: ['interaction'],
  render: () => <DrawerSidebarStates />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Workspace')).toBeVisible()
    await expect(canvas.getByText('Sidebar open: false')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Open sidebar' }))
    await waitFor(() => expect(screen.getByTestId('drawer-sidebar-panel')).toBeVisible())
    await waitFor(() => expect(screen.getByText('Organizer menu')).toBeVisible())
    await waitFor(() => expect(canvas.getByText('Sidebar open: true')).toBeVisible())
    await expect(screen.getByText('Dashboard')).toBeVisible()
    await expect(screen.getByText('Participants')).toBeVisible()
    await expect(canvas.getByText('Workspace')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Close sidebar' }))
    await waitFor(() => expect(canvas.getByText('Sidebar open: false')).toBeVisible())
  }
}
