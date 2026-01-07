import { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, TextInput, Pressable, Text } from 'react-native'
import { pug, styl, observer } from 'startupjs'
import { Slot, Link, usePathname, Stack } from 'expo-router'
import GitHubIcon from '../../svg/github-mark.svg'

export default observer(({ children }) => {
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const component = pathname.startsWith('/docs/')
    ? pathname.replace(/^\/docs\//, '').replace(/[^\w].*$/, '')
    : undefined
  useEffect(() => {
    setSearch('')
  }, [component])
  const filteredComponents = DOC_COMPONENT_NAMES.filter(name => name.toLowerCase().includes(search.toLowerCase()))

  return pug`
    View.root
      Stack.Screen(
        options={ title: 'Docs' + (component ? ' / ' + component : '') }
      )
      View.sidebar
        View.header
          Link.title(href='/') StartupJS UI
          Link(href='https://github.com/startupjs/startupjs-ui' target='_blank' accessibilityLabel='GitHub repository')
            GitHubIcon(width=24 height=24)
        TextInput.search(
          placeholder='Search...'
          placeholderTextColor='#999'
          value=search
          onChangeText=setSearch
        )
        ScrollView.items
          Category(name='Tutorial')
            each item in DOC_TUTORIAL_ITEMS
              Item(key=item.path path=item.path)= item.title
          Category(name='Foundations')
            each item in DOC_FOUNDATION_ITEMS
              Item(key=item.path path=item.path)= item.title
          Category(name='Components' defaultOpen=true)
            each component in filteredComponents
              Item(key=component path=component)= component
      ScrollView.contentWrapper
        View.content
          Slot
  `
  styl`
    .root
      flex-direction: row
      flex: 1
    .header
      padding 15px 20px
      flex-direction: row
      align-items: center
      justify-content: space-between
    .title
      font-family monospace
    .sidebar
      max-width: 200px
    .contentWrapper
      flex: 1
    .content
      flex: 1
      max-width: 800px
      width: 100%
      align-self: center
      padding: 20px 20px 0 20px
    .items
      padding-bottom 20px
    .search
      padding 10px 10px
      margin 5px 10px
      background-color #f5f5f5
      border-radius 999px
      outline none
  `
})

const Category = observer(({ children, name, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  const [isHover, setIsHover] = useState(false)
  const onHoverIn = useCallback(() => setIsHover(true), [])
  const onHoverOut = useCallback(() => setIsHover(false), [])
  return pug`
    View.root
      Pressable.header(onPress=() => setOpen(!open) onHoverIn=onHoverIn onHoverOut=onHoverOut)
        View.header-content(styleName={ isHover })
          Text.arrow(selectable=false)= open ? '-' : '+'
          Text.title(selectable=false)= name.toUpperCase()
      if open
        View.items
          = children
  `
  styl`
    .header
      user-select none
      flex-direction row
      align-items center
      padding 5px 0
    .header-content
      padding 7px 20px 5px 20px
      flex 1
      flex-direction row
      align-items center
      border-bottom-width 2px
      border-bottom-color #eee
      &.isHover
        background-color rgba(black, 0.03)
    .title, .arrow
      font-size 12px
      font-weight bold
      color #aaa
      font-family monospace
      letter-spacing 1px
    .arrow
      margin-right 10px
    .items
      margin-bottom 20px
  `
})

const Item = observer(({ children, path }) => {
  const [isHover, setIsHover] = useState(false)
  const onHoverIn = useCallback(() => setIsHover(true), [])
  const onHoverOut = useCallback(() => setIsHover(false), [])
  const pathname = usePathname()
  if (typeof children !== 'string') return 'NO_NAME'
  const name = children
  const href = '/docs/' + path
  const isActive = pathname === href
  return pug`
    Link(href=href asChild)
      Pressable.item(styleName={ isHover, isActive } onHoverIn=onHoverIn onHoverOut=onHoverOut)
        Text.text(styleName={ isHover, isActive })= name
  `
  styl`
    .item
      padding: 10px 20px
      border-radius: 0 999px 999px 0
      &.isHover
        background-color: rgba(black, 0.03)
      &.isActive
        background-color: rgba(black, 0.05)
    .text
      color #777
      &.isActive
        font-weight bold
        color black
  `
})

const DOC_COMPONENT_NAMES = [
  'AbstractPopover',
  'Alert',
  'ArrayInput',
  'AutoSuggest',
  'Avatar',
  'Badge',
  'Br',
  'Breadcrumbs',
  'Button',
  'Card',
  'Carousel',
  'Checkbox',
  'Collapse',
  'ColorPicker',
  'Content',
  'DateTimePicker',
  'Dialogs',
  'Div',
  'Divider',
  'Draggable',
  'Drawer',
  'DrawerSidebar',
  'Dropdown',
  'FileInput',
  'FlatList',
  'Form',
  'Icon',
  'Input',
  'Item',
  'Layout',
  'Link',
  'Loader',
  'Menu',
  'Modal',
  'MultiSelect',
  'NumberInput',
  'ObjectInput',
  'Pagination',
  'PasswordInput',
  'Popover',
  'Portal',
  'Progress',
  'Radio',
  'RangeInput',
  'Rank',
  'Rating',
  'ScrollView',
  'Select',
  'Sidebar',
  'SmartSidebar',
  'Span',
  'Table',
  'Tabs',
  'Tag',
  'TextInput',
  'Toast',
  'User'
]

const DOC_TUTORIAL_ITEMS = [
  { title: 'Quickstart', path: 'tutorial/foundation' },
  { title: 'To-Do app', path: 'tutorial/basics' },
  { title: 'Observer pattern', path: 'tutorial/observer' },
  { title: 'ShareDB hooks', path: 'tutorial/sharedbHooks' },
  { title: 'Racer model', path: 'tutorial/racerModel' },
  { title: 'File structure', path: 'tutorial/fileStructure' },
  { title: 'Pug', path: 'tutorial/pug' },
  { title: 'Stylus', path: 'tutorial/stylus' },
  { title: 'Tricks with styles', path: 'tutorial/tricksWithStyles' }
]

const DOC_FOUNDATION_ITEMS = [
  { title: 'Border radius', path: 'foundations/borderRadius' },
  { title: 'Collection types', path: 'foundations/collectionTypes' },
  { title: 'Colors', path: 'foundations/colors' },
  { title: 'Color customization', path: 'foundations/colorCustomization' },
  { title: 'Editing patterns', path: 'foundations/editing' },
  { title: 'Export CSS to JS', path: 'foundations/exportCSStoJS' },
  { title: 'Caching node_modules', path: 'foundations/nodeModulesCache' },
  { title: 'Security', path: 'foundations/security' },
  { title: 'WebSocket', path: 'foundations/websocket' },
  { title: 'E2E testing', path: 'foundations/e2e-tests' }
]
