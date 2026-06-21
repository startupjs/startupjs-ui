// IMPORTANT: This file exports should match package.json/exports
//            which are used by 'babel-plugin-startupjs' to generate
//            precise components' import paths for tree-shaking
//
export { default as Alert } from '@startupjs-ui/alert'
export { default as AutoSuggest } from '@startupjs-ui/auto-suggest'
export { default as Avatar } from '@startupjs-ui/avatar'
export { default as Badge } from '@startupjs-ui/badge'
export { default as Br } from '@startupjs-ui/br'
export { default as Breadcrumbs } from '@startupjs-ui/breadcrumbs'
export { default as Button } from '@startupjs-ui/button'
export { default as Card } from '@startupjs-ui/card'
export { default as Carousel } from '@startupjs-ui/carousel'
export { default as Collapse } from '@startupjs-ui/collapse'
export { default as Content } from '@startupjs-ui/content'

// dialogs
export { DialogsProvider, alert, confirm, prompt } from '@startupjs-ui/dialogs'

export { default as Div } from '@startupjs-ui/div'
export { default as Divider } from '@startupjs-ui/divider'

// draggable
export { DragDropProvider, Draggable, Droppable } from '@startupjs-ui/draggable'

export { default as DrawerSidebar } from '@startupjs-ui/drawer-sidebar'
export { default as FlatList } from '@startupjs-ui/flat-list'

// inputs
export { wrapInput, guessInput } from '@startupjs-ui/input'
export { default as Form, useFormProps } from '@startupjs-ui/form'
export { default as Input } from '@startupjs-ui/input'
export { default as ArrayInput } from '@startupjs-ui/array-input'
export { default as Checkbox } from '@startupjs-ui/checkbox'
export { default as ColorPicker } from '@startupjs-ui/color-picker'
export { default as DateTimePicker } from '@startupjs-ui/date-time-picker'
export { default as MultiSelect } from '@startupjs-ui/multi-select'
export { default as Multiselect } from './exports/_DEPRECATED_Multiselect'
export { default as NumberInput } from '@startupjs-ui/number-input'
export { default as ObjectInput } from '@startupjs-ui/object-input'
export { default as PasswordInput } from '@startupjs-ui/password-input'
export { default as Radio } from '@startupjs-ui/radio'
export { default as RangeInput } from '@startupjs-ui/range-input'
export { default as Rank } from '@startupjs-ui/rank'
export { default as Select } from '@startupjs-ui/select'
export { default as TextInput } from '@startupjs-ui/text-input'
export { default as FileInput } from '@startupjs-ui/file-input'
export { default as deleteFile } from '@startupjs-ui/file-input/deleteFile'
export { default as uploadFile } from '@startupjs-ui/file-input/uploadFile'

export { default as Icon } from '@startupjs-ui/icon'
export { default as Item } from '@startupjs-ui/item'
export { default as Layout } from '@startupjs-ui/layout'
export { default as Link } from '@startupjs-ui/link'
export { default as Loader } from '@startupjs-ui/loader'
export { default as Menu } from '@startupjs-ui/menu'
export { default as Modal } from '@startupjs-ui/modal'
export { default as Pagination } from '@startupjs-ui/pagination'

// popups
export { default as AbstractPopover } from '@startupjs-ui/abstract-popover'
export { default as Drawer } from '@startupjs-ui/drawer'
export { default as Popover } from '@startupjs-ui/popover'
export { default as Dropdown } from '@startupjs-ui/dropdown'

export { default as Portal } from '@startupjs-ui/portal'
export { default as Progress } from '@startupjs-ui/progress'
export { default as Rating } from '@startupjs-ui/rating'
export { default as Row } from './exports/_DEPRECATED_Row'
export { default as ScrollView } from '@startupjs-ui/scroll-view'
export { default as Sidebar } from '@startupjs-ui/sidebar'
export { default as SmartSidebar } from '@startupjs-ui/smart-sidebar'

// table
export { Table, Tbody, Td, Th, Thead, Tr } from '@startupjs-ui/table'

export { default as Tabs } from '@startupjs-ui/tabs'
export { default as Tag } from '@startupjs-ui/tag'

// toast
export { ToastProvider, Toast, toast } from '@startupjs-ui/toast'

export { default as Tooltip } from './exports/_DEPRECATED_Tooltip'

// typography
export { default as Span } from '@startupjs-ui/span'
export { default as H1 } from './exports/_DEPRECATED_H1'
export { default as H2 } from './exports/_DEPRECATED_H2'
export { default as H3 } from './exports/_DEPRECATED_H3'
export { default as H4 } from './exports/_DEPRECATED_H4'
export { default as H5 } from './exports/_DEPRECATED_H5'
export { default as H6 } from './exports/_DEPRECATED_H6'

export { default as User } from '@startupjs-ui/user'

// theming
export {
  colorToRGBA,
  getCssVariable,
  getThemeColor,
  getThemeColorVariableName,
  useThemeColor,
  u,
  themed,
  ThemeProvider,
  ThemeContext
} from '@startupjs-ui/core'

// hooks
export { useMedia } from '@startupjs-ui/core'
export { useFormFields, useFormFields$, useValidate } from '@startupjs-ui/form'

// UiProvider
export { default as UiProvider } from './UiProvider'
