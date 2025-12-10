import React, { useEffect, type ReactNode } from 'react'
import { Dimensions, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, $, useBind } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Sidebar from '@startupjs-ui/sidebar'
import DrawerSidebar from '@startupjs-ui/drawer-sidebar'

const FIXED_LAYOUT_BREAKPOINT = 1024

export const _PropsJsonSchema = {/* SmartSidebarProps */}

export interface SmartSidebarProps {
  /** Custom styles applied to the root wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the sidebar container when using fixed layout */
  sidebarStyle?: StyleProp<ViewStyle>
  /** Model controlling sidebar open state */
  $open?: any
  /** Open sidebar by default on desktop @default false */
  defaultOpen?: boolean
  /** Destroy sidebar content when closed @default false */
  lazy?: boolean
  /** Disable sidebar interactions @default false */
  disabled?: boolean
  /** Breakpoint width after which sidebar switches to fixed layout @default 1024 */
  fixedLayoutBreakpoint?: number
  /** Sidebar position relative to the screen @default 'left' */
  position?: 'left' | 'right'
  /** Sidebar width in density-independent pixels @default 264 */
  width?: number
  /** Content rendered inside the main area */
  children?: ReactNode
  /** Renderer for sidebar content */
  renderContent?: () => ReactNode
}

function SmartSidebar ({
  style,
  sidebarStyle,
  defaultOpen = false,
  lazy = false,
  disabled = false,
  fixedLayoutBreakpoint = FIXED_LAYOUT_BREAKPOINT,
  $open,
  position = 'left',
  width = 264,
  children,
  renderContent,
  ...props
}: SmartSidebarProps): ReactNode {
  if (!$open) $open = $()

  let open: boolean | undefined
  let onChange: ((value: boolean) => void) | undefined
  ;({ open, onChange } = useBind({ $open, open, onChange }) as any) // eslint-disable-line prefer-const

  const $fixedLayout = $(isFixedLayout(fixedLayoutBreakpoint))
  const fixedLayout = $fixedLayout.get()

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!$fixedLayout.get()) return
    // or we can save open state before disabling
    // to open it with this state when enabling
    $open.set(defaultOpen)
  }, [disabled])

  useEffect(() => {
    if (disabled) return
    if ($fixedLayout.get()) {
      // when change dimensions from mobile
      // to desktop resolution or when rendering happen on desktop resolution
      // we open sidebar if it was opened on mobile resolution or default value
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      $open.set(open || defaultOpen)
    } else {
      // when change dimensions from desktop
      // to mobile resolution or when rendering heppen for mobile resolution
      // we always close sidebars
      $open.set(false)
    }
  }, [$fixedLayout.get()])

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', handleWidthChange)

    return () => {
      subscription?.remove()
    }
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  function handleWidthChange () {
    $fixedLayout.set(isFixedLayout(fixedLayoutBreakpoint))
  }

  return pug`
    if fixedLayout
      Sidebar(
        style=style
        sidebarStyle=sidebarStyle
        $open=$open
        position=position
        width=width
        disabled=disabled
        renderContent=renderContent
        ...props
      )= children
    else
      DrawerSidebar(
        style=style
        $open=$open
        position=position
        width=width
        renderContent=renderContent
        disabled=disabled
        ...props
      )= children
  `
}

export default observer(themed('SmartSidebar', SmartSidebar))

function isFixedLayout (fixedLayoutBreakpoint: number) {
  const dim = Dimensions.get('window')
  return dim.width > fixedLayoutBreakpoint
}
