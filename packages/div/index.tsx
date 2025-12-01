import { useRef, useState, useImperativeHandle } from 'react'
import type React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type ViewProps,
  type AccessibilityRole
} from 'react-native'
import { pug, observer, u, useDidUpdate } from 'startupjs'
import { colorToRGBA, getCssVariable, themed } from '@startupjs-ui/core'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
// TODO: bring back tooltip after AbstractPopover is refactored
// import useTooltip from './useTooltip'
import STYLES from './index.styl'

const DEPRECATED_PUSHED_VALUES = ['xs', 'xl', 'xxl']
const PRESSABLE_PROPS = ['onPress', 'onLongPress', 'onPressIn', 'onPressOut']
const isWeb = Platform.OS === 'web'
const isNative = Platform.OS !== 'web'

const {
  config: {
    defaultHoverOpacity,
    defaultActiveOpacity
  }
} = STYLES

export const _PropsJsonSchema = {/* DivProps */ }

export interface DivProps extends ViewProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside Div */
  children?: React.ReactNode
  /** Visual feedback variant @default 'opacity' */
  variant?: 'opacity' | 'highlight'
  /** Render children in a horizontal row */
  row?: boolean
  /** Allow wrapping when row is enabled */
  wrap?: boolean
  /** Reverse children order for row layouts */
  reverse?: boolean
  /** Horizontal alignment when using row/column */
  align?: 'left' | 'center' | 'right'
  /** Vertical alignment when using row/column */
  vAlign?: 'top' | 'center' | 'bottom'
  /** Spacing between children (true maps to default gap) */
  gap?: boolean | number
  /** Enable press feedback styles @default true */
  feedback?: boolean
  /** Custom style for hover state */
  hoverStyle?: StyleProp<ViewStyle>
  /** Custom style for active state */
  activeStyle?: StyleProp<ViewStyle>
  /** Disable interactions and apply disabled styles */
  disabled?: boolean
  /** Elevation level controlling shadow intensity */
  level?: 0 | 1 | 2 | 3 | 4 | 5
  /** Shape of the container corners */
  shape?: 'squared' | 'rounded' | 'circle'
  /** Apply raised (pushed) padding preset */
  pushed?: boolean | 's' | 'm' | 'l'
  /** Stretch container into negative spacing area */
  bleed?: boolean
  /** Expand to take full available width */
  full?: boolean
  /** Simple tooltip text (currently disabled) */
  tooltip?: string
  /** Style overrides for tooltip element */
  tooltipStyle?: StyleProp<ViewStyle>
  /** onPress handler */
  onPress?: (e: any) => void
  /** onLongPress handler */
  onLongPress?: (e: any) => void
  /** onPressIn handler */
  onPressIn?: (e: any) => void
  /** onPressOut handler */
  onPressOut?: (e: any) => void
  /** Whether view is accessible (false disables role) */
  accessible?: boolean
  /** Accessibility role passed to native view */
  accessibilityRole?: AccessibilityRole
  /** Deprecated custom tooltip renderer */
  renderTooltip?: any // Deprecated
}
// eslint-disable-next-line @typescript-eslint/promise-function-async
function Div ({
  style = [],
  children,
  variant = 'opacity',
  row,
  wrap,
  reverse,
  align,
  vAlign,
  gap,
  hoverStyle,
  activeStyle,
  feedback = true,
  disabled,
  level = 0,
  shape,
  pushed, // By some reason prop 'push' was ignored
  bleed,
  full,
  accessible,
  accessibilityRole,
  tooltip,
  tooltipStyle,
  renderTooltip,
  ...props
}: DivProps, ref: any) {
  if (DEPRECATED_PUSHED_VALUES.includes(pushed as string)) {
    console.warn(`[@startupjs/ui] Div: variant='${pushed}' is DEPRECATED, use one of 's', 'm', 'l' instead.`)
  }

  if (renderTooltip) {
    console.warn('[@startupjs/ui] Div: renderTooltip is DEPRECATED, use \'tooltip\' property instead.')
  }

  // TODO:
  // Check NATIVE
  // Maybe it is not actual for new RN versions
  // FIXME: for native apps row-reverse switches margins and paddings
  if (isNative && reverse) {
    style = StyleSheet.flatten([style])
    const { paddingLeft, paddingRight, marginLeft, marginRight } = style
    style.marginLeft = marginRight
    style.marginRight = marginLeft
    style.paddingLeft = paddingRight
    style.paddingRight = paddingLeft
  }

  if (gap === true) gap = 2

  const isClickable = hasPressHandler(props)
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const viewRef = useRef()

  useImperativeHandle(ref, () => viewRef.current, [])

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (!isClickable) return
    if (!disabled) return
    if (hover) setHover(false)
    if (active) setActive(false)
  }, [isClickable, disabled])

  if (isClickable) {
    // setup hover and active states styles and props
    if (feedback) {
      const { onPressIn, onPressOut } = props

      props.onPressIn = (...args) => {
        setActive(true)
        onPressIn?.(...args)
      }
      props.onPressOut = (...args) => {
        setActive(false)
        onPressOut?.(...args)
      }

      if (isWeb && !disabled) {
        const { onMouseEnter, onMouseLeave } = props

        props.onMouseEnter = (...args) => {
          setHover(true)
          onMouseEnter?.(...args)
        }
        props.onMouseLeave = (...args) => {
          setHover(false)
          onMouseLeave?.(...args)
        }
      }
    }

    for (const prop of PRESSABLE_PROPS) {
      const pressHandler = props[prop]
      if (!pressHandler) continue
      props[prop] = (...args) => {
        if (disabled) return
        pressHandler(...args)
      }
    }
  }

  // TODO: bring back tooltip after AbstractPopover is refactored
  // const { tooltipElement, tooltipEventHandlers } = useTooltip({
  //   style: tooltipStyle,
  //   anchorRef: viewRef,
  //   tooltip
  // })

  // for (const tooltipEventHandlerName in tooltipEventHandlers) {
  //   const divHandler = props[tooltipEventHandlerName]
  //   const tooltipHandler = tooltipEventHandlers[tooltipEventHandlerName]

  //   props[tooltipEventHandlerName] = divHandler
  //     ? (...args) => { tooltipHandler(...args); divHandler(...args) }
  //     : tooltipHandler
  // }

  let pushedModifier
  let levelModifier
  const pushedSize = typeof pushed === 'boolean' && pushed ? 'm' : pushed
  if (pushedSize) pushedModifier = `pushed-${pushedSize}`
  // skip level 0 for shadow
  // because it needed only when you want to override shadow from style sheet
  if (level) levelModifier = `shadow-${level}`

  // hover or active state styles
  // active state takes precedence over hover state
  let extraStyle: StyleProp<ViewStyle> = {}
  if (active) {
    extraStyle = activeStyle ?? getDefaultStyle(style, 'active', variant)
  } else if (hover) {
    extraStyle = hoverStyle ?? getDefaultStyle(style, 'hover', variant)
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  function maybeWrapToClickable (children: React.ReactNode) {
    if (isClickable) {
      const role = accessible !== false ? accessibilityRole ?? 'button' : undefined
      const touchableProps = pick(props, PRESSABLE_PROPS)
      return pug`
        TouchableWithoutFeedback(focusable=accessible accessibilityRole=role ...touchableProps)
          = children
      `
    } else {
      return children
    }
  }

  const viewProps = omit(props, PRESSABLE_PROPS)

  if (!isClickable) {
    viewProps.accessibilityRole = accessible !== false ? accessibilityRole : undefined
  }

  const testID = viewProps.testID || viewProps['data-testid']
  // backgroundColor in style can override extraStyle backgroundColor
  // so passing the extraStyle to the end is important in this case
  const divElement = maybeWrapToClickable(pug`
    View.root(
      ref=viewRef
      style=[
        gap ? { gap: u(gap) } : undefined,
        style,
        extraStyle
      ]
      styleName=[
        [row ? 'row' : 'column'],
        { wrap, reverse },
        align,
        'v_' + vAlign,
        {
          clickable: isWeb && isClickable,
          bleed,
          full,
          disabled
        },
        shape,
        pushedModifier,
        levelModifier
      ]
      testID=testID
      ...viewProps
    )= children
  `)

  return pug`
    = divElement
    // TODO: bring back tooltip after AbstractPopover is refactored
    // = tooltipElement
  `
}

function hasPressHandler (props) {
  return PRESSABLE_PROPS.some(prop => props[prop])
}

export default observer(themed('Div', Div), { forwardRef: true })

function getDefaultStyle (style, type, variant) {
  if (variant === 'opacity') {
    if (type === 'hover') return { opacity: defaultHoverOpacity }
    if (type === 'active') return { opacity: defaultActiveOpacity }
  } else {
    style = StyleSheet.flatten(style)
    let backgroundColor = style.backgroundColor
    if (backgroundColor === 'transparent') backgroundColor = undefined

    if (type === 'hover') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultHoverOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: getCssVariable('--Div-hoverBg') }
      }
    }

    if (type === 'active') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultActiveOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: getCssVariable('--Div-activeBg') }
      }
    }
  }
}
