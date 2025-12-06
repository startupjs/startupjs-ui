import { useMemo, useState, type ReactNode } from 'react'
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { Colors, themed, useColors } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import './index.cssx.styl'

const ICON_SIZES = {
  s: 'xs',
  m: 's',
  l: 'm'
}

export default observer(themed('Badge', Badge))

export const _PropsJsonSchema = {/* BadgeProps */}

export interface BadgeProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the badge view */
  badgeStyle?: StyleProp<ViewStyle>
  /** Content rendered inside Badge */
  children?: ReactNode
  /** Background color name @default 'primary' */
  color?: string
  /** Label content rendered inside badge */
  label?: string | number
  /** Icon displayed inside badge */
  icon?: object
  /** Badge vertical position @default 'top' */
  position?: 'top' | 'bottom'
  /** Badge size preset @default 'm' */
  size?: 's' | 'm' | 'l'
  /** Badge appearance variant @default 'default' */
  variant?: 'default' | 'dot'
  /** Maximum number to display before adding "+" */
  max?: number
}

function Badge ({
  style,
  badgeStyle,
  children,
  color = Colors.primary,
  label,
  icon,
  position = 'top',
  size = 'm',
  variant = 'default',
  max
}: BadgeProps): ReactNode {
  const [right, setRight] = useState(0)
  const getColor = useColors()

  badgeStyle = StyleSheet.flatten([
    { right, backgroundColor: getColor(color) },
    badgeStyle
  ]) as StyleProp<ViewStyle>

  const textAndIconColor = getColor(Colors[`text-on-${color}`]) ?? getColor(Colors['text-on-color'])

  const hasLabel = useMemo(() => {
    return variant === 'default'
      ? typeof label === 'string'
        ? +label !== 0
        : !!label
      : false
  }, [variant, label])

  function getLabel (label: any, max?: number) {
    return max && label > max ? max + '+' : label
  }

  function onLayout (event: any) {
    const { width } = event.nativeEvent.layout
    setRight(Math.ceil(width / 2) * -1)
  }

  return pug`
    Div.root(style=style)
      = children
      if hasLabel || variant === 'dot'
        Div.badge(
          row
          style=badgeStyle
          onLayout=onLayout
          styleName=[
            size,
            variant,
            position,
            { hasLabel, visible: !!right }
          ]
        )
          if variant === 'default'
            if icon
              Icon(
                style={ color: textAndIconColor }
                icon=icon
                size=ICON_SIZES[size]
              )
            Span.label(style={ color: textAndIconColor } styleName=[size, { icon }])= getLabel(label, max)
  `
}
