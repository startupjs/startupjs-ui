import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { pug, styl, observer, $, useCssVariable } from 'startupjs'
import { colorVariableRequest, themed } from '@startupjs-ui/core'
import findIndex from 'lodash/findIndex'
import pick from 'lodash/pick'
import Bar, { TAB_BAR_PROP_NAMES } from './Bar'

export const _PropsJsonSchema = {/* TabsProps */} // used in docs generation

const TAB_VIEW_PROP_NAMES = [
  'navigationState',
  'renderScene',
  'onTabSelect',
  'initialLayout',
  'keyboardDismissMode',
  'lazy',
  'lazyPreloadDistance',
  'onSwipeStart',
  'onSwipeEnd',
  'renderLazyPlaceholder',
  'sceneContainerStyle',
  'pagerStyle',
  'style',
  'swipeEnabled',
  'tabBarPosition',
  'direction',
  'animationEnabled',
  'overScrollMode',
  'options',
  'commonOptions'
]

export interface TabsProps {
  /** Tabs configuration containing keys and titles */
  routes: TabsRoute[]
  /** Key of the initially active tab when uncontrolled */
  initialKey?: string
  /** Scoped model controlling the active tab key */
  $value?: any
  /** Handler called when active tab changes with the new key */
  onChange?: (key: string) => void
  /** Handler called when the tab index changes @deprecated use onChange instead */
  onIndexChange?: (index: number) => void
  /** Handler called when a tab is selected */
  onTabSelect?: (props: { index: number }) => void
  /** Custom TabBar renderer */
  renderTabBar?: (props: any) => ReactNode
  /** Custom navigation state passed directly to TabView */
  navigationState?: any
  /** Scene renderer returning content for each route */
  renderScene?: (props: any) => ReactNode
  /** Initial layout configuration passed to TabView */
  initialLayout?: any
  /** Controls keyboard dismiss mode for TabView */
  keyboardDismissMode?: string
  /** Enable lazy rendering for scenes */
  lazy?: boolean
  /** Distance of routes to preload while lazy loading */
  lazyPreloadDistance?: number
  /** Called when swipe gesture starts */
  onSwipeStart?: () => void
  /** Called when swipe gesture ends */
  onSwipeEnd?: () => void
  /** Placeholder renderer while lazy loading scenes */
  renderLazyPlaceholder?: (props: any) => ReactNode
  /** Style applied to scene container */
  sceneContainerStyle?: StyleProp<ViewStyle>
  /** Style applied to the pager */
  pagerStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the root TabView */
  style?: StyleProp<ViewStyle>
  /** Deprecated alias for style applied to TabView root */
  tabsStyle?: StyleProp<ViewStyle>
  /** Allow switching tabs with swipe gestures */
  swipeEnabled?: boolean
  /** Position of the tab bar */
  tabBarPosition?: 'top' | 'bottom'
  /** Locale direction passed to TabView */
  direction?: 'ltr' | 'rtl'
  /** Enable page transition animation */
  animationEnabled?: boolean
  /** Android overscroll mode */
  overScrollMode?: 'auto' | 'always' | 'never'
  /** Custom icon renderer for the tab bar */
  renderIcon?: (props: any) => ReactNode
  /** Custom renderer for tab bar items */
  renderTabBarItem?: (props: any) => ReactNode
  /** DEPRECATED and won't work! Use renderTabBarItem instead @deprecated */
  renderLabel?: (props: any) => ReactNode
  /** Custom indicator renderer */
  renderIndicator?: (props: any) => ReactNode
  /** Custom badge renderer */
  renderBadge?: (props: any) => ReactNode
  /** Tab press handler */
  onTabPress?: (props: any) => void
  /** Tab long-press handler */
  onTabLongPress?: (props: any) => void
  /** Active label color @default 'primary' */
  activeColor?: string
  /** Inactive label color @default 'text-description' */
  inactiveColor?: string
  /** Ripple color for pressed tab */
  pressColor?: string
  /** Ripple opacity for pressed tab */
  pressOpacity?: number
  /** Allow scrolling tabs when they overflow */
  scrollEnabled?: boolean
  /** Enable bounce effect for scrollable tabs */
  bounces?: boolean
  /** Style applied to individual tabs */
  tabStyle?: StyleProp<ViewStyle>
  /** Style applied to the indicator */
  indicatorStyle?: StyleProp<ViewStyle>
  /** Style applied to indicator container */
  indicatorContainerStyle?: StyleProp<ViewStyle>
  /** Style applied to tab labels */
  labelStyle?: StyleProp<ViewStyle>
  /** Style applied to tab bar content container */
  contentContainerStyle?: StyleProp<ViewStyle>
  /** Per-route options passed through to react-native-tab-view */
  options?: Record<string, any>
  /** Shared route options passed through to react-native-tab-view */
  commonOptions?: Record<string, any>
}

export interface TabsRoute {
  /** Route key used to identify the tab */
  key: string
  /** Visible title displayed in the tab bar */
  title: string
  /** Test identifier for the tab */
  testID?: string
  /** Additional route metadata passed through to react-native-tab-view */
  [key: string]: any
}

function Tabs ({
  tabsStyle,
  routes,
  initialKey,
  $value,
  renderTabBar,
  renderLabel, // deprecated and won't work. Throw an error to inform the user
  activeColor = 'primary',
  inactiveColor = 'text-description',
  onChange,
  onIndexChange, // skip property
  ...props
}: TabsProps): ReactNode {
  if (renderLabel) throw Error('[@startupjs/ui -> Tabs] `renderLabel` prop is deprecated and no longer supported. Use `renderTabBarItem` instead.')
  if (tabsStyle) console.warn('[@startupjs/ui -> Tabs] `tabsStyle` prop is deprecated. Use `style` instead.')

  const activeColorRequest = colorVariableRequest(activeColor)
  const inactiveColorRequest = colorVariableRequest(inactiveColor)
  const resolvedActiveColor = (useCssVariable(activeColorRequest.name, activeColorRequest.fallback) as string | undefined) ?? activeColor
  const resolvedInactiveColor = (useCssVariable(inactiveColorRequest.name, inactiveColorRequest.fallback) as string | undefined) ?? inactiveColor
  const $localValue = $value ?? $(initialKey ?? routes[0]?.key)
  const tabBarProps = pick(props, TAB_BAR_PROP_NAMES)
  const tabViewProps = pick(props, TAB_VIEW_PROP_NAMES)

  const tabIndex = findIndex(routes, { key: $localValue.get() })

  function _renderTabBar (tabBarViewProps: any): ReactNode {
    const resolvedTabBarProps = {
      ...tabBarProps,
      ...tabBarViewProps
    }

    if (renderTabBar) return renderTabBar(resolvedTabBarProps)

    return pug`
      Bar.bar(
        activeColor=resolvedActiveColor
        inactiveColor=resolvedInactiveColor
        ...resolvedTabBarProps
      )
    `
  }

  function _onIndexChange (index: number) {
    const key = routes[index].key
    if (onChange) {
      onChange(key)
    } else {
      $localValue.set(key)
    }
  }

  return pug`
    TabView(
      part='root'
      style=tabsStyle
      navigationState={ index: tabIndex, routes }
      renderTabBar=_renderTabBar
      onIndexChange=_onIndexChange
      ...tabViewProps
    )
  `
  styl`
    .bar
      background-color transparent
      &:part(indicator)
        background-color var(--color-bg-primary)

    .label
      &.focused
        color var(--color-primary)
  `
}

const ObservedTabs: any = observer(themed('Tabs', Tabs))

ObservedTabs.Bar = Bar

export default ObservedTabs
