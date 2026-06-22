import { type ReactNode, type Ref } from 'react'
import { Platform, ScrollView as RNScrollView, type StyleProp, type ViewProps } from 'react-native'
import { pug, observer, themed } from 'startupjs'
import { type UIRole } from '@startupjs-ui/core'
import './index.cssx.styl'

const IS_NATIVE = Platform.OS !== 'web'

export default observer(themed('ScrollView', ScrollView))

export const _PropsJsonSchema = {/* ScrollViewProps */}

export interface ScrollViewProps {
  /** Ref to access the underlying ScrollView instance */
  ref?: Ref<any>
  /** Accessibility role. Includes RN roles plus web-only ARIA roles used by RNW. */
  role?: UIRole
  /** Custom styles applied to the root ScrollView */
  style?: StyleProp<any>
  /** Content rendered inside ScrollView */
  children?: ReactNode
  /** Expand content container to take full available height */
  full?: boolean
  /** Additional props forwarded to the underlying ScrollView */
  [key: string]: any
}

function ScrollView ({
  ref,
  full = false,
  ...props
}: ScrollViewProps): ReactNode {
  if (IS_NATIVE && isWebOnlyRole(props.role)) delete props.role

  const renderProps = props as Omit<typeof props, 'role'> & { role?: ViewProps['role'] }

  return pug`
    RNScrollView.root(ref=ref part='root' styleName={ full } ...renderProps)
  `
}

function isWebOnlyRole (role: unknown): role is Exclude<UIRole, ViewProps['role']> {
  return role === 'listbox' || role === 'gridcell'
}
