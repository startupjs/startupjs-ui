import { useContext, type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssColor, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import Item, { type ItemProps } from '@startupjs-ui/item'
import Span from '@startupjs-ui/span'
import MenuContext from '../context'

export const _PropsJsonSchema = {/* MenuItemProps */} // used in docs generation

export interface MenuItemProps extends Omit<ItemProps, 'style' | 'onPress' | 'icon' | 'to'> {
  /** Custom styles applied to the content wrapper */
  containerStyle?: StyleProp<ViewStyle>
  /** Content rendered inside the item */
  children?: ReactNode
  /** Highlight item as active @default false */
  active?: boolean
  /** Active border position @default 'none' */
  activeBorder?: 'top' | 'bottom' | 'left' | 'right' | 'none'
  /** Color applied to active item text, icon and border */
  activeColor?: string
  /** Render text in bold */
  bold?: boolean
  /** Icon displayed alongside the label */
  icon?: IconProps['icon']
  /** Icon position relative to the label @default 'left' */
  iconPosition?: 'left' | 'right'
  /** Text/icon color override */
  color?: string
  /** Navigation target passed to underlying Item */
  to?: string
  /** Handler called on item press */
  onPress?: ItemProps['onPress']
  /** Web accessibility role forwarded to the interactive root */
  role?: ItemProps['role']
  /** Whether the option is selected (for listbox/combobox patterns on web) */
  'aria-selected'?: boolean
  /** Accessible name when item text is not plain text */
  'aria-label'?: string
}

function MenuItem ({
  children,
  containerStyle,
  active = false,
  bold,
  icon,
  role,
  'aria-selected': ariaSelected,
  'aria-label': ariaLabel,
  ...props
}: MenuItemProps): ReactNode {
  const context = useContext(MenuContext)

  const colorToken = props.color ?? context.color ?? 'foreground'
  const activeColorToken = props.activeColor ?? context.activeColor ?? 'primary'
  const resolvedColor = useCssColor(colorToken) ?? colorToken
  const resolvedActiveColor = useCssColor(activeColorToken) ?? activeColorToken
  const activeBorder = props.activeBorder ?? context.activeBorder ?? 'none'
  const iconPosition = props.iconPosition ?? context.iconPosition ?? 'left'

  // TODO: prevent click if already active (for link and for div)
  const color = active ? resolvedActiveColor : resolvedColor
  const borderStyle: StyleProp<ViewStyle> = { backgroundColor: resolvedActiveColor }

  const optionLabel = ariaLabel ??
    (typeof children === 'string' || typeof children === 'number' ? String(children) : undefined)

  return pug`
    Div
      Item(
        ...props
        role=role
        aria-label=optionLabel
        aria-selected=ariaSelected
      )
        if icon && iconPosition === 'left'
          Item.Left
            Icon(icon=icon style={ color })

        Item.Content(style=[containerStyle])
          Span(bold=bold style={ color })= children

        if icon && iconPosition === 'right'
          Item.Right
            Icon(icon=icon style={ color })

      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder] style=borderStyle)
  `
}

export default observer(themed('MenuItem', MenuItem))

css`
  .border {
    position: absolute;
  }

  .border.top,
  .border.bottom {
    left: 0;
    right: 0;
    height: var(--MenuItem-active-border-size);
  }

  .border.top {
    top: 0;
  }

  .border.bottom {
    bottom: 0;
  }

  .border.left,
  .border.right {
    top: 0;
    bottom: 0;
    width: var(--MenuItem-active-border-size);
  }

  .border.left {
    left: 0;
  }

  .border.right {
    right: 0;
  }
`
