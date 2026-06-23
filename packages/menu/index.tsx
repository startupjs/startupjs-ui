import { useMemo, type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import MenuItem from './MenuItem'
import Context, { type MenuContextValue } from './context'

export const _PropsJsonSchema = {/* MenuProps */} // used in docs generation

export interface MenuProps extends Omit<DivProps, 'variant' | 'style'> {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside Menu */
  children?: ReactNode
  /** Active border position passed to Menu items */
  activeBorder?: 'top' | 'bottom' | 'left' | 'right' | 'none'
  /** Color applied to active Menu items */
  activeColor?: string
  /** Icon position applied to nested Menu items @default 'left' */
  iconPosition?: 'left' | 'right'
  /** Layout orientation @default 'vertical' */
  variant?: 'vertical' | 'horizontal'
}

function Menu ({
  style,
  children,
  variant = 'vertical',
  activeBorder,
  iconPosition,
  activeColor,
  ...props
}: MenuProps): ReactNode {
  const value = useMemo<MenuContextValue>(() => {
    return { activeBorder, activeColor, iconPosition }
  }, [activeBorder, activeColor, iconPosition])

  return pug`
    Context.Provider(value=value)
      Div.root(
        part='root'
        style=style
        styleName=[variant]
        ...props
      )= children
  `
}

css`
  .root.horizontal {
    flex-direction: row;
  }
`

const ObservedMenu: any = observer(themed('Menu', Menu))

ObservedMenu.Item = MenuItem

export { default as MenuItem } from './MenuItem'
export default ObservedMenu
