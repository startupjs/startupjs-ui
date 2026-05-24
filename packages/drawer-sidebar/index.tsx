import React, { useRef, type ReactNode } from 'react'
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import DrawerLayoutModule from 'react-native-drawer-layout-polyfill'
import { pug, observer, $, useDidUpdate } from 'startupjs'
import { themed, useColors } from '@startupjs-ui/core'

const DrawerLayout = DrawerLayoutModule.default || DrawerLayoutModule
if (!DrawerLayout) throw Error("> Can't load DrawerLayout module. Issues with bundling.")

let isEffectRunning: boolean | undefined

export const _PropsJsonSchema = {/* DrawerSidebarProps */}

export interface DrawerSidebarProps {
  /** Custom styles applied to the root DrawerLayout */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside the main area */
  children?: ReactNode
  /** Model controlling drawer open state */
  $open?: any
  /** Drawer position relative to the screen @default 'left' */
  position?: 'left' | 'right'
  /** Render drawer content only when open @default false */
  lazy?: boolean
  /** Disable drawer interactions @default false */
  disabled?: boolean
  /** Drawer width in density-independent pixels @default 264 */
  width?: number
  /** Renderer for drawer content */
  renderContent?: () => ReactNode
  /** Test identifier applied to the drawer content scroll view */
  testID?: string
}

function DrawerSidebar ({
  style = [],
  children,
  $open,
  position = 'left',
  lazy = false,
  disabled = false,
  width = 264,
  renderContent,
  testID,
  ...props
}: DrawerSidebarProps): ReactNode {
  const getColor = useColors()

  if (!$open) $open = $()

  const flattenedStyle = StyleSheet.flatten(style) || {}
  const { backgroundColor = getColor('bg-main-strong'), ...restStyle } =
    flattenedStyle as Record<string, any>

  const open = $open.get()

  const drawerRef = useRef<any>(null)

  useDidUpdate(() => {
    if (disabled) return
    const drawer = drawerRef.current

    isEffectRunning = true

    if (open) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [!!open])

  const renderNavigationView = (): ReactNode => {
    const render = lazy ? open : true
    if (!render) return null
    return pug`
      ScrollView(testID=testID contentContainerStyle={ flex: 1 })
        = renderContent && renderContent()
    `
  }

  // drawer callback's are scheduled and not called synchronously
  // and when the open state changes several times in a short period of time
  // these scheduled callback's can create an infinite loop
  function onDrawerCallback (openState: boolean) {
    if (typeof isEffectRunning === 'undefined') $open.set(openState)
    isEffectRunning = undefined
  }

  return pug`
    DrawerLayout.root(
      style=restStyle
      drawerPosition=position
      drawerWidth=width
      drawerBackgroundColor=backgroundColor
      ref=drawerRef
      renderNavigationView=renderNavigationView
      onDrawerClose=() => onDrawerCallback(false)
      onDrawerOpen=() => onDrawerCallback(true)
      drawerLockMode=disabled ? 'locked-closed' : undefined
      ...props
    )= children
  `
}

export default observer(themed('DrawerSidebar', DrawerSidebar))
