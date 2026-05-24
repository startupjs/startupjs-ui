import { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor } from 'storybook/test'
import { $, observer } from 'startupjs'
import {
  AbstractPopover,
  Alert,
  ArrayInput,
  AutoSuggest,
  Avatar,
  Badge,
  Br,
  Breadcrumbs,
  Button,
  Card,
  Carousel,
  Checkbox,
  Collapse,
  ColorPicker,
  Content,
  DateTimePicker,
  Div,
  Divider,
  Drawer,
  DrawerSidebar,
  Dropdown,
  FlatList,
  Form,
  Icon,
  Input,
  Item,
  Layout,
  Link,
  Loader,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  ObjectInput,
  Pagination,
  PasswordInput,
  Popover,
  Portal,
  Progress,
  Radio,
  RangeInput,
  Rank,
  Rating,
  ScrollView,
  Select,
  Sidebar,
  SmartSidebar,
  Span,
  Table,
  Tabs,
  Tag,
  Tbody,
  Td,
  TextInput,
  Th,
  Thead,
  Toast,
  Tr,
  User
} from 'startupjs-ui'
import { faCircleInfo, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons'
import { InlineRow, StorySection, StoryStack } from './helpers'

const PERSON_OPTIONS = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' }
]

const CANVAS_TEST_IDS = [
  'tid-alert',
  'tid-array-input',
  'tid-auto-suggest',
  'tid-avatar',
  'tid-badge',
  'tid-br',
  'tid-breadcrumbs',
  'tid-button',
  'tid-card',
  'tid-carousel',
  'tid-checkbox',
  'tid-collapse',
  'tid-color-picker',
  'tid-content',
  'tid-date-time-picker',
  'tid-div',
  'tid-divider',
  'tid-dropdown',
  'tid-flat-list',
  'tid-form',
  'tid-input',
  'tid-item',
  'tid-layout',
  'tid-link',
  'tid-loader',
  'tid-menu',
  'tid-multi-select',
  'tid-number-input',
  'tid-object-input',
  'tid-pagination',
  'tid-password-input',
  'tid-progress',
  'tid-radio',
  'tid-range-input',
  'tid-rank',
  'tid-rating',
  'tid-scroll-view',
  'tid-select',
  'tid-sidebar',
  'tid-smart-sidebar',
  'tid-span',
  'tid-table',
  'tid-tbody',
  'tid-td',
  'tid-text-input',
  'tid-th',
  'tid-thead',
  'tid-toast',
  'tid-tr',
  'tid-tag',
  'tid-user'
] as const

const PORTAL_TEST_IDS = [
  'tid-abstract-popover',
  'tid-drawer',
  'tid-modal',
  'tid-popover',
  'tid-portal-content'
] as const

const TestIdMatrix = observer(function TestIdMatrix () {
  const $value = $({
    array: ['Ada Lovelace'],
    checkbox: true,
    color: '#336699',
    date: Date.UTC(2026, 0, 21, 14, 45),
    form: { name: 'Ada Lovelace' },
    multiselect: ['ada'],
    number: 42,
    object: { city: 'London' },
    password: 'secret',
    radio: 'ada',
    range: 35,
    rank: ['ada', 'grace'],
    select: 'ada',
    text: 'Ada Lovelace'
  })
  const $open = $(true)
  const $popoverVisible = $(false)
  const abstractAnchorRef = useRef<any>({
    measure: (callback: any) => callback(0, 0, 220, 64, 40, 120)
  })
  const routes = [
    { key: 'overview', title: 'Overview', 'aria-label': 'Overview tab', testID: 'tid-tabs-overview' },
    { key: 'notes', title: 'Notes', 'aria-label': 'Notes tab', testID: 'tid-tabs-notes' }
  ]

  return (
    <StoryStack>
      <StorySection title='General components'>
        <Alert testID='tid-alert'>Alert</Alert>
        <AutoSuggest
          testID='tid-auto-suggest'
          value='ada'
          options={PERSON_OPTIONS}
          aria-label='Participant search'
          onChange={() => {}}
        />
        <Avatar testID='tid-avatar'>AL</Avatar>
        <Badge testID='tid-badge' label={2}>
          <Span>Inbox</Span>
        </Badge>
        <Br testID='tid-br' />
        <Breadcrumbs
          testID='tid-breadcrumbs'
          routes={[
            { name: 'Home', to: '#home', icon: faSearch },
            { name: 'Current', icon: faCircleInfo }
          ]}
        />
        <Button testID='tid-button' onPress={() => {}}>Button</Button>
        <Card testID='tid-card' style={{ padding: 12 }}>
          <Span>Card</Span>
        </Card>
        <Carousel
          testID='tid-carousel'
          style={{ width: 320, height: 120 }}
        >
          <Card style={{ width: 240, minWidth: 240, maxWidth: 240, height: 80, padding: 12 }}>
            <Span>Carousel slide</Span>
          </Card>
          <Card style={{ width: 240, minWidth: 240, maxWidth: 240, height: 80, padding: 12 }}>
            <Span>Carousel slide two</Span>
          </Card>
        </Carousel>
        <Collapse testID='tid-collapse' title='Collapse' open>
          <Span>Collapsed content</Span>
        </Collapse>
        <Content testID='tid-content' padding>
          <Span>Content</Span>
        </Content>
        <Div testID='tid-div'>
          <Span>Div</Span>
        </Div>
        <Divider testID='tid-divider' />
        <FlatList
          testID='tid-flat-list'
          data={['FlatList row']}
          renderItem={({ item }) => <Span>{item}</Span>}
        />
        <Icon icon={faHeart} />
        <Item testID='tid-item' onPress={() => {}}>Item</Item>
        <Layout testID='tid-layout'>
          <Span>Layout</Span>
        </Layout>
        <Link testID='tid-link' href='https://startupjs.org'>Link</Link>
        <Loader testID='tid-loader' aria-label='Loader' />
        <Menu testID='tid-menu'>
          <Menu.Item onPress={() => {}}>Menu item</Menu.Item>
        </Menu>
        <Pagination testID='tid-pagination' page={0} pages={2} onChangePage={() => {}} />
        <Progress testID='tid-progress' value={50}>Progress</Progress>
        <Rating testID='tid-rating' value={3} onChange={() => {}} />
        <ScrollView testID='tid-scroll-view' style={{ maxHeight: 80 }}>
          <Span>ScrollView</Span>
        </ScrollView>
        <Sidebar
          testID='tid-sidebar'
          $open={$open}
          width={180}
          renderContent={() => <Span>Sidebar content</Span>}
        >
          <Span>Sidebar workspace</Span>
        </Sidebar>
        <SmartSidebar
          testID='tid-smart-sidebar'
          $open={$open}
          fixedLayoutBreakpoint={1}
          width={180}
          renderContent={() => <Span>Smart sidebar content</Span>}
        >
          <Span>Smart sidebar workspace</Span>
        </SmartSidebar>
        <Span testID='tid-span'>Span</Span>
        <Table testID='tid-table'>
          <Thead testID='tid-thead'>
            <Tr testID='tid-tr'>
              <Th testID='tid-th'>Name</Th>
            </Tr>
          </Thead>
          <Tbody testID='tid-tbody'>
            <Tr>
              <Td testID='tid-td'>Ada Lovelace</Td>
            </Tr>
          </Tbody>
        </Table>
        <Tabs
          routes={routes}
          renderScene={() => <Span>Tab scene</Span>}
          initialKey='overview'
        />
        <Tag testID='tid-tag'>Tag</Tag>
        <Toast
          testID='tid-toast'
          show
          height={72}
          topPosition={0}
          title='Toast'
          onLayout={() => {}}
        />
        <User testID='tid-user' name='Ada Lovelace' description='User row' />
      </StorySection>

      <StorySection title='Input components'>
        <ArrayInput
          testID='tid-array-input'
          $value={$value.array}
          items={{ type: 'string', label: 'Alias' }}
        />
        <Checkbox
          testID='tid-checkbox'
          value={$value.checkbox.get()}
          aria-label='Checkbox'
          onChange={() => {}}
        />
        <ColorPicker
          testID='tid-color-picker'
          value={$value.color.get()}
          aria-label='Color'
          onChangeColor={() => {}}
        />
        <DateTimePicker
          testID='tid-date-time-picker'
          date={$value.date.get()}
          aria-label='Date time'
          onChangeDate={() => {}}
        />
        <Form
          testID='tid-form'
          $value={$value.form}
          fields={{
            name: { type: 'string', label: 'Form name' }
          }}
        />
        <Input
          testID='tid-input'
          $value={$value.text}
          label='Input'
          type='text'
        />
        <MultiSelect
          testID='tid-multi-select'
          value={$value.multiselect.get()}
          options={PERSON_OPTIONS}
          aria-label='People'
          onChange={() => {}}
        />
        <NumberInput
          testID='tid-number-input'
          value={$value.number.get()}
          aria-label='Number'
          onChangeNumber={() => {}}
        />
        <ObjectInput
          testID='tid-object-input'
          $value={$value.object}
          properties={{
            city: { type: 'string', label: 'City' }
          }}
        />
        <PasswordInput
          testID='tid-password-input'
          value={$value.password.get()}
          aria-label='Password'
          onChangeText={() => {}}
        />
        <Radio
          testID='tid-radio'
          value={$value.radio.get()}
          options={PERSON_OPTIONS}
          aria-label='Radio group'
          onChange={() => {}}
        />
        <RangeInput
          testID='tid-range-input'
          value={$value.range.get()}
          onChange={() => {}}
        />
        <Rank
          testID='tid-rank'
          value={$value.rank.get()}
          options={PERSON_OPTIONS}
          onChange={() => {}}
        />
        <Select
          testID='tid-select'
          value={$value.select.get()}
          options={PERSON_OPTIONS}
          aria-label='Select'
          onChange={() => {}}
        />
        <TextInput
          testID='tid-text-input'
          value={$value.text.get()}
          aria-label='Text input'
          onChangeText={() => {}}
        />
      </StorySection>

      <StorySection title='Overlay components'>
        <Div ref={abstractAnchorRef} style={{ width: 220 }}>
          <Button>Abstract anchor</Button>
        </Div>
        <AbstractPopover
          visible
          anchorRef={abstractAnchorRef}
          testID='tid-abstract-popover'
        >
          <Card style={{ padding: 12 }}>
            <Span>Abstract popover</Span>
          </Card>
        </AbstractPopover>
        <Drawer
          testID='tid-drawer'
          visible
          position='bottom'
          onDismiss={() => {}}
        >
          <Card style={{ padding: 12 }}>
            <Span>Drawer content</Span>
          </Card>
        </Drawer>
        <DrawerSidebar
          $open={$open}
          width={180}
          renderContent={() => <Span>Drawer sidebar content</Span>}
        >
          <Span>Drawer sidebar workspace</Span>
        </DrawerSidebar>
        <Dropdown testID='tid-dropdown' aria-label='Dropdown'>
          <Dropdown.Item value='ada' label='Ada Lovelace' />
        </Dropdown>
        <Modal
          testID='tid-modal'
          visible
          title='Modal'
          enableBackdropPress={false}
        >
          <Span>Modal content</Span>
        </Modal>
        <Popover
          testID='tid-popover'
          $visible={$popoverVisible}
          renderContent={() => (
            <Card style={{ padding: 12 }}>
              <Span>Popover content</Span>
            </Card>
          )}
        >
          <Button>Popover anchor</Button>
        </Popover>
        <Portal>
          <Div testID='tid-portal-content'>
            <Span>Portal content</Span>
          </Div>
        </Portal>
      </StorySection>

      <InlineRow>
        <Span description>
          This story verifies standard RN testID where the component can expose it without adding structural wrappers.
        </Span>
      </InlineRow>
    </StoryStack>
  )
})

const meta = {
  title: 'Testability/TestID',
  component: TestIdMatrix,
  parameters: {
    startupjsLayout: 'fullscreen'
  }
} satisfies Meta<typeof TestIdMatrix>

export default meta

type Story = StoryObj<typeof meta>

export const Components: Story = {
  tags: ['interaction'],
  render: () => <TestIdMatrix />,
  play: async ({ canvas, userEvent }) => {
    for (const testID of CANVAS_TEST_IDS) {
      await waitFor(() => expect(canvas.getByTestId(testID)).toBeInTheDocument())
    }

    await expect(canvas.getByRole('tab', { name: 'Overview tab' })).toBeVisible()
    await expect(canvas.getByTestId('tid-tabs-overview')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Popover anchor' }))

    for (const testID of PORTAL_TEST_IDS) {
      await waitFor(() => expect(screen.getByTestId(testID)).toBeInTheDocument())
    }
  }
}
