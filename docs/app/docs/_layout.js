import { useState, useEffect, useCallback, useMemo } from 'react'
import { View, ScrollView, TextInput, Pressable, Dimensions, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { pug, styl, observer } from 'startupjs'
import { Slot, Link, usePathname, Stack } from 'expo-router'
import GitHubIcon from '../../svg/github-mark.svg'
import ProjectsSidebar from '../../components/ProjectsSidebar'

const TABLET_BREAKPOINT = 768

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default observer(({ children }) => {
  // TODO: use dynamic color scheme when it's supported in docs (import from 'react-native')
  // const colorScheme = useColorScheme()
  const colorScheme = 'light'
  const initialWidth = useMemo(() => Dimensions.get('window').width, [])
  const [showSidebar, setShowSidebar] = useState(initialWidth >= TABLET_BREAKPOINT)
  const toggleSidebar = useCallback(() => setShowSidebar(!showSidebar), [showSidebar])
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const component = pathname.startsWith('/docs/')
    ? pathname.replace(/^\/docs\//, '').replace(/[^\w].*$/, '')
    : undefined
  useEffect(() => {
    setSearch('')
  }, [component])

  const filteredCategories = useMemo(() => {
    if (!search) return DOC_COMPONENT_CATEGORIES
    const lower = search.toLowerCase()
    return DOC_COMPONENT_CATEGORIES
      .map(cat => ({
        ...cat,
        items: cat.items.filter(name => name.toLowerCase().includes(lower))
      }))
      .filter(cat => cat.items.length > 0)
  }, [search])

  return pug`
    View.root
      ProjectsSidebar(colorScheme=colorScheme)
      View.main
        Stack.Screen(
          options={ title: 'Docs' + (component ? ' / ' + component : '') }
        )
        Pressable.toggleSidebar(styleName={ showSidebar } onPress=toggleSidebar)
          View.line
          View.line
          View.line
        Animated.View.sidebar(styleName={ show: showSidebar })
          View.header
            Link.title(href='/') StartupJS UI
            GitHubLink
          TextInput.search(
            placeholder='Search...'
            placeholderTextColor='#999'
            value=search
            onChangeText=setSearch
          )
          ScrollView.items
            each cat in filteredCategories
              Category(key=cat.name name=cat.name defaultOpen=true)
                each component in cat.items
                  Item(key=component path=component setShowSidebar=setShowSidebar)= component
        ScrollView.contentWrapper
          View.content
            Slot
  `
  styl`
    .root
      flex-direction: row
      flex: 1
    .main
      flex: 1
      flex-direction: row
    .header
      padding 15px 20px 15px 45px
      flex-direction: row
      align-items: center
      justify-content: space-between
    .title
      font-family monospace
    .toggleSidebar
      $topOffset = 5px // hacky way to align with header
      $togglePadding = 10px
      position: absolute
      top: 15px + $topOffset - $togglePadding
      left: 15px - $togglePadding
      z-index: 2
      height: 16px + $togglePadding * 2
      width: @height
      align-items: center
      justify-content: center
      border-radius: 5px
      background-color: white
      box-shadow: 0 2px 4px rgba(0,0,0,0.2)
      user-select: none
      &.showSidebar
        box-shadow: none
    .line
      height: 1.5px
      width: 15px
      background-color: #888
      margin: 2px 0
    .sidebar
      $sidebarWidth = 200px
      width: $sidebarWidth
      max-width: @width
      animation: slideInLeft 0.5s ease-out
      background-color white
      left 0
      top 0
      bottom 0
      z-index 1
      position absolute
      display: none
      border-right-width 1px
      border-right-color #eee
      &.show
        display: flex
      // sidebar pushes content only if there is not enough space for it
      // to show in the left padding of content
      +between($UI.media.tablet, $UI.media.tablet + $sidebarWidth * 2 + 10px * 2)
        position relative
      +tablet()
        border-right-width 0
    .contentWrapper
      flex: 1
      +to($UI.media.tablet)
        padding-top: 20px
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
    @keyframes slideInLeft
      0%
        transform: translateX(-100%)
        opacity: 0
      50%
        opacity: 0.7
        transform: translateX(0)
      100%
        opacity: 1
  `
})

const GitHubLink = observer(() => {
  const [isHover, setIsHover] = useState(false)
  const onHoverIn = useCallback(() => setIsHover(true), [])
  const onHoverOut = useCallback(() => setIsHover(false), [])
  return pug`
    AnimatedPressable.show(styleName={ isHover } onHoverIn=onHoverIn onHoverOut=onHoverOut)
      Link(href='https://github.com/startupjs/startupjs-ui' target='_blank' accessibilityLabel='GitHub repository')
        GitHubIcon(width=24 height=24)
  `
  styl`
    .show
      opacity: 0.5
      transition: opacity 0.2s
      &.isHover
        opacity: 1
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

const Item = observer(({ children, path, setShowSidebar }) => {
  const [isHover, setIsHover] = useState(false)
  const onHoverIn = useCallback(() => setIsHover(true), [])
  const onHoverOut = useCallback(() => setIsHover(false), [])
  const pathname = usePathname()
  if (typeof children !== 'string') return 'NO_NAME'
  const name = children
  const href = '/docs/' + path
  const isActive = pathname === href
  const onPress = useCallback(() => {
    if (Dimensions.get('window').width < TABLET_BREAKPOINT) {
      // close sidebar on item press for small screens
      // to give more space for content
      setShowSidebar(false)
    }
  }, [setShowSidebar])
  return pug`
    Link(href=href asChild)
      AnimatedPressable.item(styleName={ isHover, isActive } onHoverIn=onHoverIn onHoverOut=onHoverOut onPress=onPress)
        Animated.Text.text(styleName={ isHover, isActive })= name
  `
  styl`
    .item
      padding: 10px 20px
      border-radius: 0 999px 999px 0
      background-color: rgba(black, 0)
      transition: background-color 0.2s
      &.isHover
        transition: none
        background-color: rgba(black, 0.03)
      &.isActive
        transition: background-color 0.2s
        background-color: rgba(black, 0.05)
    .text
      font-family monospace
      color #777
      transition: color 0.2s
      &.isActive
        font-weight bold
        color black
  `
})

const DOC_COMPONENT_CATEGORIES = [
  {
    name: 'Layout & Structure',
    items: ['Div', 'Content', 'Card', 'Layout', 'Sidebar', 'SmartSidebar', 'DrawerSidebar', 'Drawer', 'ScrollView', 'FlatList', 'Portal', 'Divider', 'Br']
  },
  {
    name: 'Typography',
    items: ['Span']
  },
  {
    name: 'Buttons & Actions',
    items: ['Button', 'Link', 'Tag']
  },
  {
    name: 'Form Inputs',
    items: ['TextInput', 'Checkbox', 'NumberInput', 'PasswordInput', 'Select', 'MultiSelect', 'Radio', 'RangeInput', 'ColorPicker', 'DateTimePicker', 'FileInput', 'Input', 'ArrayInput', 'ObjectInput', 'Form', 'Rank', 'Rating', 'AutoSuggest']
  },
  {
    name: 'Feedback & Overlays',
    items: ['Alert', 'Modal', 'Popover', 'Dropdown', 'Loader', 'Progress', 'Toast', 'Badge', 'Collapse']
  },
  {
    name: 'Navigation & Data',
    items: ['Tabs', 'Breadcrumbs', 'Pagination', 'Menu', 'Item', 'Table']
  },
  {
    name: 'Display',
    items: ['Avatar', 'Icon', 'User', 'Carousel', 'AbstractPopover']
  },
  {
    name: 'Drag & Drop',
    items: ['Draggable']
  },
  {
    name: 'Providers',
    items: ['Dialogs']
  }
]
