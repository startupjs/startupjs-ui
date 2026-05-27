import { useContext, type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed, useColors } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import Item, { type ItemProps } from '@startupjs-ui/item'
import Span from '@startupjs-ui/span'
import MenuContext from '../context'
import './index.cssx.styl'

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
  const getColor = useColors()

  // TODO
  // we should think about a better api
  // and remove color, activeColor, activeBorder props
  let color: string | undefined = props.color ?? context.color
  color = getColor(color) ?? color
  let activeColor = props.activeColor ?? context.activeColor
  activeColor = getColor(activeColor) ?? activeColor
  const activeBorder = props.activeBorder ?? context.activeBorder ?? 'none'
  const iconPosition = props.iconPosition ?? context.iconPosition ?? 'left'

  // TODO: prevent click if already active (for link and for div)
  color = active ? (activeColor ?? getColor('text-primary')) : (color ?? getColor('text-main'))
  const borderStyle: StyleProp<ViewStyle> = { backgroundColor: activeColor ?? getColor('border-primary') }

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
