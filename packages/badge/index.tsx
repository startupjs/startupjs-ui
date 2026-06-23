import { useMemo, useState, type ReactNode } from 'react'
import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssColor, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'

const ICON_SIZES = {
  s: 'xs',
  m: 's',
  l: 'm'
}

const COLOR_TOKEN_RE = /^[A-Za-z][A-Za-z0-9_-]*$/

function isSemanticColorToken (value: string): boolean {
  return COLOR_TOKEN_RE.test(value.trim())
}

export default themed('Badge', observer(Badge))

export const _PropsJsonSchema = {/* BadgeProps */}

export interface BadgeProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the badge view */
  badgeStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the badge icon */
  iconStyle?: StyleProp<TextStyle>
  /** Custom styles applied to the badge label */
  labelStyle?: StyleProp<TextStyle>
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
  /** Test identifier */
  testID?: string
}

function Badge ({
  style,
  badgeStyle,
  iconStyle,
  labelStyle,
  children,
  color = 'primary',
  label,
  icon,
  position = 'top',
  size = 'm',
  variant = 'default',
  max,
  testID
}: BadgeProps): ReactNode {
  const [right, setRight] = useState(0)
  const isSemanticColor = isSemanticColorToken(color)
  const foregroundToken = isSemanticColor ? `${color}-foreground` : 'primary-foreground'
  const resolvedBackgroundColor = useCssColor(color)
  const backgroundColor = resolvedBackgroundColor ?? color
  const foregroundColor = useCssColor(foregroundToken)
  const fallbackForegroundColor = useCssColor('primary-foreground')
  const textAndIconColor = foregroundColor ?? fallbackForegroundColor

  if (!resolvedBackgroundColor && isSemanticColor) console.error(`Badge component: Unknown color token "${color}"`)

  badgeStyle = StyleSheet.flatten([
    { right, backgroundColor },
    badgeStyle
  ]) as StyleProp<ViewStyle>
  iconStyle = StyleSheet.flatten([
    { color: textAndIconColor },
    iconStyle
  ]) as StyleProp<TextStyle>
  labelStyle = StyleSheet.flatten([
    { color: textAndIconColor },
    labelStyle
  ]) as StyleProp<TextStyle>

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
    Div.root(part='root' style=style testID=testID)
      = children
      if hasLabel || variant === 'dot'
        Div.badge(
          part='badge'
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
                part='icon'
                style=iconStyle
                icon=icon
                size=ICON_SIZES[size]
              )
            Span.label(part='label' style=labelStyle styleName=[size, { icon }])= getLabel(label, max)
  `
}

css`
  .root {
    position: relative;
    align-self: flex-start;
  }

  .badge {
    position: absolute;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-color: var(--Badge-border-color);
    opacity: 0;
  }

  .badge.visible {
    opacity: 1;
  }

  .badge.s {
    min-width: var(--Badge-size-s);
    height: var(--Badge-size-s);
    border-radius: calc(var(--Badge-size-s) / 2);
  }

  .badge.s.top {
    top: calc(var(--Badge-size-s) / -2);
  }

  .badge.s.bottom {
    bottom: calc(var(--Badge-size-s) / -2);
  }

  .badge.m {
    min-width: var(--Badge-size-m);
    height: var(--Badge-size-m);
    border-radius: calc(var(--Badge-size-m) / 2);
  }

  .badge.m.top {
    top: calc(var(--Badge-size-m) / -2);
  }

  .badge.m.bottom {
    bottom: calc(var(--Badge-size-m) / -2);
  }

  .badge.l {
    min-width: var(--Badge-size-l);
    height: var(--Badge-size-l);
    border-radius: calc(var(--Badge-size-l) / 2);
  }

  .badge.l.top {
    top: calc(var(--Badge-size-l) / -2);
  }

  .badge.l.bottom {
    bottom: calc(var(--Badge-size-l) / -2);
  }

  .badge.dot {
    min-width: var(--Badge-size-dot);
    height: var(--Badge-size-dot);
    border-radius: calc(var(--Badge-size-dot) / 2);
  }

  .badge.dot.top {
    top: calc(var(--Badge-size-dot) / -2);
  }

  .badge.dot.bottom {
    bottom: calc(var(--Badge-size-dot) / -2);
  }

  .badge.hasLabel.s {
    padding-left: var(--Badge-padding-x-s);
    padding-right: var(--Badge-padding-x-s);
  }

  .badge.hasLabel.m {
    padding-left: var(--Badge-padding-x-m);
    padding-right: var(--Badge-padding-x-m);
  }

  .badge.hasLabel.l {
    padding-left: var(--Badge-padding-x-l);
    padding-right: var(--Badge-padding-x-l);
  }

  .label.s {
    font-size: var(--Badge-font-size-s);
    line-height: var(--Badge-line-height-s);
  }

  .label.m {
    font-size: var(--Badge-font-size-m);
    line-height: var(--Badge-line-height-m);
  }

  .label.l {
    font-size: var(--Badge-font-size-l);
    line-height: var(--Badge-line-height-l);
  }

  .label.icon {
    margin-left: var(--Badge-icon-gap);
  }
`
