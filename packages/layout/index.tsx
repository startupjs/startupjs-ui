import { type ReactNode } from 'react'
import { SafeAreaView, StatusBar, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import STYLES from './index.cssx.styl'

const { config: { bgColor } } = STYLES

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
  return pug`
    SafeAreaView.root(part='root' style=style testID=testID)
      StatusBar(
        backgroundColor=bgColor
        barStyle='dark-content'
      )
      = children
  `
}

export default observer(themed('Layout', Layout))
