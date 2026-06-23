import { type ReactNode } from 'react'
import { SafeAreaView, StatusBar, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'

export const _PropsJsonSchema = {/* LayoutProps */}

export interface LayoutProps {
  /** Custom styles applied to the root safe area view */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside layout */
  children?: ReactNode
  /** Test identifier */
  testID?: string
}

function Layout ({ style, children, testID }: LayoutProps): ReactNode {
  const backgroundColor = useCssVariable('--Layout-bg', 'var(--color-background)')

  return pug`
    SafeAreaView.root(part='root' style=style testID=testID)
      StatusBar(
        backgroundColor=backgroundColor
        barStyle='dark-content'
      )
      = children
  `
}

export default observer(themed('Layout', Layout))

css`
  .root {
    height: 100%;
    background-color: var(--Layout-bg);
    overflow: hidden;
  }
`
