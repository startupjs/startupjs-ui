import { type ReactNode } from 'react'
import { TabBar } from 'react-native-tab-view'
import { pug, observer } from 'startupjs'

export const TAB_BAR_PROP_NAMES = [
  'getLabelText',
  'getAccessible',
  'getAccessibilityLabel',
  'getTestID',
  'renderIcon',
  'renderTabBarItem',
  'renderLabel',
  'renderIndicator',
  'renderBadge',
  'onTabPress',
  'onTabLongPress',
  'activeColor',
  'inactiveColor',
  'pressColor',
  'pressOpacity',
  'scrollEnabled',
  'bounces',
  'tabStyle',
  'indicatorStyle',
  'indicatorContainerStyle',
  'labelStyle',
  'contentContainerStyle',
  'style'
] as const

export type BarProps = Record<string, any>

function Bar ({
  ...props
}: BarProps): ReactNode {
  return pug`
    TabBar(...props)
  `
}

const ObservedBar: any = observer(Bar)

export default ObservedBar
