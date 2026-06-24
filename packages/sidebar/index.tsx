import { type ReactNode } from 'react'
import { ScrollView, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssColor, themed } from 'startupjs'
import Div from '@startupjs-ui/div'

export default themed('Sidebar', observer(Sidebar))

export const _PropsJsonSchema = {/* SidebarProps */}

export interface SidebarProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the sidebar container */
  sidebarStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the main content container */
  contentStyle?: StyleProp<ViewStyle>
  /** Content rendered inside the main area */
  children?: ReactNode
  /** Model controlling sidebar open state */
  $open?: any
  /** Sidebar position relative to the content @default 'left' */
  position?: 'left' | 'right'
  /** Disable sidebar toggling @default false */
  disabled?: boolean
  /** Sidebar width in density-independent pixels @default 264 */
  width?: number
  /** Render sidebar content only when open @default false */
  lazy?: boolean
  /** Custom renderer for sidebar content */
  renderContent?: () => ReactNode
  /** Test identifier */
  testID?: string
}

function Sidebar ({
  style,
  sidebarStyle,
  contentStyle,
  children,
  $open,
  position = 'left',
  disabled = false,
  width = 264,
  lazy = false,
  renderContent,
  testID
}: SidebarProps): ReactNode {
  const defaultBackgroundColor = useCssColor('var(--Sidebar-bg, var(--color-background))')

  const flattenedStyle = StyleSheet.flatten(style) || {}
  const { backgroundColor = defaultBackgroundColor, ...restStyle } = flattenedStyle

  const open = disabled ? false : $open?.get()

  function renderSidebarContent (): ReactNode {
    const render = lazy ? open : true
    if (!render) return null
    return renderContent && renderContent()
  }

  return pug`
    Div.root(part='root' style=restStyle styleName=[position] testID=testID)
      ScrollView.sidebar(
        contentContainerStyle=[{ flex: 1 }, sidebarStyle]
        styleName={ open }
        style={ width, backgroundColor }
      )= renderSidebarContent()
      View.main(part='content' style=contentStyle)= children
  `
}

css`
  .root {
    height: 100%;
    flex-direction: row;
    flex-shrink: 1;
  }

  .root.right {
    flex-direction: row-reverse;
  }

  .sidebar {
    flex-direction: column;
    display: none;
    flex-grow: 0;
  }

  .sidebar.open {
    display: flex;
  }

  .main {
    flex-direction: column;
    flex: 1;
  }
`
