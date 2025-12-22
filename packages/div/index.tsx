import { useState, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import {
  View,
  Pressable,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type ViewProps,
  type AccessibilityRole
} from 'react-native'
import { pug, observer, u, useDidUpdate } from 'startupjs'
import { colorToRGBA, getCssVariable, themed } from '@startupjs-ui/core'
import useTooltip, { tooltipEventHandlersList, type TooltipEventHandlers } from './useTooltip'
import STYLES from './index.cssx.styl'

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

export default observer(themed('Div', Div))

export const _PropsJsonSchema = {/* DivProps */}

export interface DivProps extends ViewProps {
  /** Ref to access underlying <View> or <Pressable> */
  ref?: RefObject<any>
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside Div */
  children?: ReactNode
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
  /** Enable press feedback styles (hover and active states) @default true */
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
  /** Add more space from the previous sibling */
  pushed?: boolean | 's' | 'm' | 'l'
  /** Stretch container into negative spacing area */
  bleed?: boolean
  /** Expand to take full available height (or width if 'row' is true) */
  full?: boolean
  /** Simple tooltip text */
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
  /** Whether view is accessible and focusable (if you can press it it's focusable by default) */
  accessible?: boolean
  /** Accessibility role passed to native view (if you can press it it's a 'button') */
  accessibilityRole?: AccessibilityRole
  /** Deprecated custom tooltip renderer @deprecated */
  renderTooltip?: any // Deprecated
  /** Test ID for testing purposes */
  'data-testid'?: string
}

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
  pushed, // History: for some reason the prop 'push' was ignored
  bleed,
  full,
  accessible,
  accessibilityRole,
  tooltip,
  tooltipStyle,
  renderTooltip,
  ref,
  ...props
}: DivProps): ReactNode {
  assertDeprecatedValues({ pushed, renderTooltip })
  style = StyleSheet.flatten(style)
  // on RN row-reverse switches margins and paddings sides, so we switch them back
  if (isNative && reverse) style = reverseMarginPaddingSides(style)
  if (gap === true) gap = 2
  const isPressable = hasPressHandler(props)
  const fallbackRef = useRef<any>(null)
  const rootRef = ref ?? fallbackRef

  let pressableStyle: StyleProp<ViewStyle> = {}
  ;({
    props,
    pressableStyle,
    accessibilityRole
  } = useDecoratePressableProps({
    props,
    style,
    activeStyle,
    hoverStyle,
    variant,
    isPressable,
    disabled,
    accessibilityRole,
    feedback
  }))

  const { tooltipElement, tooltipEventHandlers } = useTooltip({
    style: tooltipStyle,
    anchorRef: rootRef,
    tooltip
  })

  const extraEventHandlerProps: TooltipEventHandlers = useMemo(() => {
    const res: TooltipEventHandlers = {}
    for (const handlerName of tooltipEventHandlersList) {
      const tooltipHandler = tooltipEventHandlers[handlerName]
      if (!tooltipHandler) continue
      const divHandler = (props as TooltipEventHandlers)[handlerName]

      res[handlerName] = divHandler
        ? (...args: any[]) => {
            tooltipHandler(...args)
            divHandler(...args)
          }
        : tooltipHandler
    }
    return res
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    tooltipEventHandlers,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...tooltipEventHandlersList.map(handlerName => (props as TooltipEventHandlers)[handlerName])
  ])
  props = { ...props, ...extraEventHandlerProps }

  let pushedModifier
  if (pushed) {
    if (typeof pushed === 'boolean') pushed = 'm'
    pushedModifier = `pushed-${pushed}`
  }

  let levelModifier
  if (level) levelModifier = `shadow-${level}`

  if (!accessible) accessibilityRole = undefined

  const Component = isPressable ? Pressable : View
  const testID = props.testID ?? props['data-testid']
  const divElement = pug`
    Component.root(
      ref=rootRef
      style=[
        gap ? { gap: u(gap) } : undefined,
        style,
        pressableStyle
      ]
      styleName=[
        row ? 'row' : 'column',
        { wrap, reverse },
        align,
        'v_' + vAlign,
        {
          clickable: isWeb && isPressable,
          bleed,
          full,
          disabled
        },
        shape,
        pushedModifier,
        levelModifier
      ]
      accessible=accessible
      accessibilityRole=accessibilityRole
      testID=testID
      ...props
    )= children
  `

  if (tooltipElement) {
    return pug`
      = divElement
      = tooltipElement
    `
  } else return divElement
}

function useDecoratePressableProps ({
  props,
  style,
  activeStyle,
  hoverStyle,
  variant,
  isPressable,
  disabled,
  accessibilityRole,
  feedback
}: {
  props: Record<string, any>
  style: StyleProp<ViewStyle>
  activeStyle: StyleProp<ViewStyle>
  hoverStyle: StyleProp<ViewStyle>
  variant: 'opacity' | 'highlight'
  isPressable: boolean
  disabled?: boolean
  accessibilityRole?: AccessibilityRole
  feedback?: boolean
}): {
    props: Record<string, any>
    pressableStyle?: StyleProp<ViewStyle>
    accessibilityRole?: AccessibilityRole
  } {
  let pressableStyle: StyleProp<ViewStyle> = {}
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (!isPressable) return
    if (disabled) {
      if (hover) setHover(false)
      if (active) setActive(false)
    }
  }, [isPressable, disabled])

  // decorate the element state (hover, active) only if it's pressable
  if (!isPressable) return { props }

  accessibilityRole ??= 'button'
  props.focusable ??= true

  // setup hover and active states styles and props
  if (feedback) {
    const { onPressIn, onPressOut } = props

    props.onPressIn = (...args: any[]) => {
      setActive(true)
      onPressIn?.(...args)
    }
    props.onPressOut = (...args: any[]) => {
      setActive(false)
      onPressOut?.(...args)
    }

    if (isWeb && !disabled) {
      const { onMouseEnter, onMouseLeave } = props

      props.onMouseEnter = (...args: any[]) => {
        setHover(true)
        onMouseEnter?.(...args)
      }
      props.onMouseLeave = (...args: any[]) => {
        setHover(false)
        onMouseLeave?.(...args)
      }
    }
    // hover or active state styles
    // active state takes precedence over hover state
    if (active) {
      pressableStyle = activeStyle ?? getDefaultStyle(style, 'active', variant)
    } else if (hover) {
      pressableStyle = hoverStyle ?? getDefaultStyle(style, 'hover', variant)
    }
  }

  // if disabled, disable all press handlers
  for (const prop of PRESSABLE_PROPS) {
    const pressHandler = props[prop]
    if (!pressHandler) continue
    props[prop] = (...args: any[]) => {
      if (disabled) return
      pressHandler(...args)
    }
  }

  return { props, pressableStyle, accessibilityRole }
}

function getDefaultStyle (
  style: StyleProp<ViewStyle>,
  type: 'hover' | 'active',
  variant?: 'opacity' | 'highlight'
): StyleProp<ViewStyle> | undefined {
  if (variant === 'opacity') {
    if (type === 'hover') return { opacity: defaultHoverOpacity }
    if (type === 'active') return { opacity: defaultActiveOpacity }
  } else {
    style = StyleSheet.flatten(style)
    let backgroundColor = style.backgroundColor
    if (backgroundColor === 'transparent') backgroundColor = undefined

    if (type === 'hover') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor as string, defaultHoverOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: getCssVariable('--Div-hoverBg') as string | undefined }
      }
    }

    if (type === 'active') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor as string, defaultActiveOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: getCssVariable('--Div-activeBg') as string | undefined }
      }
    }
  }
}

function hasPressHandler (props: Record<string, any>): boolean {
  return PRESSABLE_PROPS.some(prop => props[prop])
}

function reverseMarginPaddingSides (style: StyleProp<ViewStyle>) {
  style = StyleSheet.flatten(style)
  const { paddingLeft, paddingRight, marginLeft, marginRight } = style
  style.marginLeft = marginRight
  style.marginRight = marginLeft
  style.paddingLeft = paddingRight
  style.paddingRight = paddingLeft
  return style
}

function assertDeprecatedValues ({ pushed, renderTooltip }: { pushed?: any, renderTooltip?: any }) {
  if (DEPRECATED_PUSHED_VALUES.includes(pushed)) console.warn(ERRORS.DEPRECATED_PUSHED(pushed))
  if (renderTooltip) console.warn(ERRORS.DEPRECATED_RENDER_TOOLTIP)
}

const ERRORS = {
  DEPRECATED_PUSHED: (pushed: string) => `
    [@startupjs/ui] Div: variant='${pushed}' is DEPRECATED, use one of 's', 'm', 'l' instead.
  `,
  DEPRECATED_RENDER_TOOLTIP: `
    [@startupjs/ui] Div: renderTooltip is DEPRECATED, use 'tooltip' property instead.
  `
}
