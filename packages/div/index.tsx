import { Children, cloneElement, createElement, Fragment, isValidElement, useContext, useLayoutEffect, useMemo, useState, useRef, type ReactNode, type RefObject } from 'react'
import {
  View, Pressable, Platform, StyleSheet, type StyleProp, type ViewStyle, type ViewProps
} from 'react-native'
import Animated from 'react-native-reanimated'
import { css, pug, observer, getCssColor, useCssVariable, useDidUpdate, themed } from 'startupjs'
import { type UIRole } from '@startupjs-ui/core'
import {
  TextStyleContext,
  getInheritedTextStyle,
  mergeInheritedTextStyles,
  omitInheritedTextStyle
} from '@startupjs-ui/span/textStyleContext'
import Span from '@startupjs-ui/span'
import { useDecorateTooltipProps } from './useTooltip'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type AriaHasPopup = boolean | 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree'

const DEPRECATED_PUSHED_VALUES = ['xs', 'xl', 'xxl']
const PRESSABLE_PROPS = ['onPress', 'onLongPress', 'onPressIn', 'onPressOut']
const isWeb = Platform.OS === 'web'
const isNative = Platform.OS !== 'web'

export default themed('Div', observer(Div))

export const _PropsJsonSchema = {/* DivProps */}

export interface DivProps extends Omit<ViewProps, 'role'> {
  /** Ref to access underlying <View> or <Pressable> */
  ref?: RefObject<any>
  /** Accessibility role. Includes RN roles plus web-only ARIA roles used by RNW. */
  role?: UIRole
  /** Web popup type exposed through aria-haspopup */
  'aria-haspopup'?: AriaHasPopup
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Content rendered inside Div */
  children?: ReactNode
  /** Auto-wrap bare text children. When true, runs of consecutive string/number
   * children (including those inside arrays/fragments) are each wrapped into a
   * single text node so they render correctly in a non-text container. @default false */
  supportTextNodes?: boolean
  /** How to render an auto-wrapped text run (only used with supportTextNodes).
   * Receives the merged text; should return a text element. Defaults to <Span/>. */
  renderTextNode?: (text: string) => ReactNode
  /** Visual feedback variant @default 'opacity' */
  variant?: 'opacity' | 'highlight'
  /** Render children in a horizontal row */
  row?: boolean
  /** Allow wrapping when row is enabled */
  wrap?: boolean
  /** Reverse children order for row layouts */
  reverse?: boolean
  /** Horizontal alignment when using row/column. Row also supports Row-compatible distribution values. */
  align?: 'left' | 'center' | 'right' | 'around' | 'between'
  /** Vertical alignment when using row/column. Row also supports Row-compatible cross-axis values. */
  vAlign?: 'top' | 'center' | 'bottom' | 'stretch' | 'start' | 'end'
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
  /** Deprecated custom tooltip renderer @deprecated */
  renderTooltip?: any // Deprecated
  /** Internal: render a native <button> host on web when the resolved role is button */
  _webNativeButton?: boolean
}

function Div ({
  style: rawStyle = [],
  children,
  supportTextNodes = false,
  renderTextNode,
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
  tooltip,
  tooltipStyle,
  renderTooltip,
  _webNativeButton = false,
  ref,
  ...props
}: DivProps): ReactNode {
  assertDeprecatedValues({ pushed, renderTooltip })
  const renderedChildren = supportTextNodes ? wrapTextChildren(children, renderTextNode) : children
  let style = StyleSheet.flatten(rawStyle) as ViewStyle | undefined
  // on RN row-reverse switches margins and paddings sides, so we switch them back
  if (isNative && reverse) style = reverseMarginPaddingSides(style)

  const inheritedTextStyle = useContext(TextStyleContext)
  const ownTextStyle = getInheritedTextStyle(style)
  const nextInheritedTextStyleKey = simpleNumericHash(JSON.stringify([inheritedTextStyle, ownTextStyle]))
  const nextInheritedTextStyle = useMemo(() => {
    if (!ownTextStyle) return undefined
    return mergeInheritedTextStyles(inheritedTextStyle, ownTextStyle)
  }, [nextInheritedTextStyleKey]) // eslint-disable-line react-hooks/exhaustive-deps
  omitInheritedTextStyle(style)

  if (gap === true) gap = 2
  const isPressable = hasPressHandler(props)
  const fallbackRef = useRef<any>(null)
  const rootRef = ref ?? fallbackRef
  const spacing = toNumber(useCssVariable('--spacing', 4), 4)
  const defaultHoverOpacity = toNumber(useCssVariable('--Div-hover-opacity', 0.8), 0.8)
  const defaultActiveOpacity = toNumber(useCssVariable('--Div-active-opacity', 0.5), 0.5)
  const defaultHoverBg = useCssVariable('--Div-hover-bg') as string | undefined
  const defaultActiveBg = useCssVariable('--Div-active-bg') as string | undefined

  let pressableStyle: StyleProp<ViewStyle> = {}
  let deferredRole: string | undefined
  ;({
    props,
    pressableStyle,
    deferredRole
  } = useDecoratePressableProps({
    props,
    style,
    activeStyle,
    hoverStyle,
    variant,
    isPressable,
    disabled,
    feedback,
    webNativeButton: _webNativeButton,
    defaultHoverBg,
    defaultActiveBg,
    defaultHoverOpacity,
    defaultActiveOpacity
  }))

  ;({
    props,
    accessible
  } = useDecorateAccessibilityProps({
    props,
    rootRef,
    disabled,
    accessible,
    isPressable,
    deferredRole,
    webNativeButton: _webNativeButton
  }))

  let tooltipElement
  ;({
    props,
    tooltipElement
  } = useDecorateTooltipProps({
    props,
    style: tooltipStyle,
    anchorRef: rootRef,
    tooltip
  }))

  let pushedModifier
  if (pushed) {
    if (typeof pushed === 'boolean') pushed = 'm'
    pushedModifier = `pushed-${pushed}`
  }

  let levelModifier
  if (level) levelModifier = `shadow-${level}`

  const isAnimated = hasAnimatedProperty(style) || hasAnimatedProperty(pressableStyle)
  const Component = isPressable
    ? (isAnimated ? AnimatedPressable : Pressable)
    : (isAnimated ? Animated.View : View)
  const renderProps = props as Omit<typeof props, 'role'> & { role?: ViewProps['role'] }
  const divElement = pug`
    Component.root(
      ref=rootRef
      style=[
        gap ? { gap: gap * 2 * spacing } : undefined,
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
      ...renderProps
    )= renderedChildren
  `
  const styledDivElement = nextInheritedTextStyle
    ? pug`
      TextStyleContext.Provider(value=nextInheritedTextStyle)
        = divElement
    `
    : divElement

  if (tooltipElement) {
    return pug`
      = styledDivElement
      = tooltipElement
    `
  } else return styledDivElement
}

// Auto-wrap bare text so it renders in a non-text container. Each maximal run of
// consecutive string/number children is merged into one text node (so 'a {x} b'
// becomes one line, not three stacked nodes); element children break a run;
// fragments are traversed inline; arrays are already flattened by React.Children.
function wrapTextChildren (children: ReactNode, renderTextNode?: (text: string) => ReactNode): ReactNode {
  const out: ReactNode[] = []
  let run = ''
  let key = 0
  const flush = () => {
    if (run === '') return
    const text = run
    run = ''
    const node = renderTextNode ? renderTextNode(text) : createElement(Span, null, text)
    out.push(isValidElement(node) ? cloneElement(node, { key: `__t${key++}` }) : node)
  }
  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, child => {
      if (child == null || typeof child === 'boolean') return
      if (typeof child === 'string' || typeof child === 'number') { run += String(child); return }
      if (isValidElement(child) && child.type === Fragment) { walk((child.props as { children?: ReactNode }).children); return }
      flush()
      out.push(isValidElement(child) && child.key == null ? cloneElement(child, { key: `__e${key++}` }) : child)
    })
  }
  walk(children)
  flush()
  return out
}

function isWebOnlyRole (role: unknown): role is Exclude<UIRole, ViewProps['role']> {
  return role === 'listbox' || role === 'gridcell'
}

function hasAnimatedProperty (style: any): boolean {
  if (!style) return false
  return Object.keys(style).some(key => key.startsWith('animation') || key.startsWith('transition'))
}

function useDecorateAccessibilityProps ({
  props,
  rootRef,
  disabled,
  accessible,
  isPressable,
  deferredRole,
  webNativeButton
}: {
  props: Record<string, any>
  rootRef: RefObject<any>
  disabled?: boolean
  accessible?: boolean
  isPressable: boolean
  deferredRole?: string
  webNativeButton?: boolean
}): {
    props: Record<string, any>
    accessible?: boolean
  } {
  if (accessible == null && isPressable) accessible = true
  if (accessible === false) {
    deferredRole = undefined
    props.role = undefined
  }

  if (props['aria-disabled'] == null && disabled != null) {
    props['aria-disabled'] = disabled
  }

  if (isNative && isWebOnlyRole(props.role)) delete props.role
  if (isNative) delete props['aria-haspopup']

  const roleProp = props.role
  const ariaDisabled = props['aria-disabled']

  useLayoutEffect(() => {
    if (!isWeb) return
    const node = rootRef.current
    if (!node || typeof node.setAttribute !== 'function') return
    // Keep role declarative by default too. This manual patch is only for the
    // deferred-role web path where we intentionally avoid a native <button>
    // host to prevent invalid nested-button markup, but still need button
    // semantics on the resulting DOM node.
    if (deferredRole != null) {
      node.setAttribute('role', deferredRole)
    } else if (roleProp == null) {
      node.removeAttribute('role')
    }
    // Keep the RN / aria props declarative by default. This manual patch is only
    // for the current RN Web bug where disabled semantics are dropped on the
    // deferred-role pressable path that we use to avoid nested native buttons.
    if (ariaDisabled != null) {
      node.setAttribute('aria-disabled', String(ariaDisabled))
    } else {
      node.removeAttribute('aria-disabled')
    }
    if (webNativeButton && 'disabled' in node) {
      node.disabled = !!disabled
    }
  }, [rootRef, deferredRole, roleProp, ariaDisabled, webNativeButton, disabled])

  return { props, accessible }
}

function useDecoratePressableProps ({
  props,
  style,
  activeStyle,
  hoverStyle,
  variant,
  isPressable,
  disabled,
  feedback,
  webNativeButton,
  defaultHoverBg,
  defaultActiveBg,
  defaultHoverOpacity,
  defaultActiveOpacity
}: {
  props: Record<string, any>
  style: StyleProp<ViewStyle>
  activeStyle: StyleProp<ViewStyle>
  hoverStyle: StyleProp<ViewStyle>
  variant: 'opacity' | 'highlight'
  isPressable: boolean
  disabled?: boolean
  feedback?: boolean
  webNativeButton?: boolean
  defaultHoverBg?: string
  defaultActiveBg?: string
  defaultHoverOpacity: number
  defaultActiveOpacity: number
}): {
    props: Record<string, any>
    pressableStyle?: StyleProp<ViewStyle>
    deferredRole?: string
  } {
  let pressableStyle: StyleProp<ViewStyle> = {}
  let deferredRole: string | undefined
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

  const resolvedRole = props.role ?? 'button'
  props.focusable ??= true

  if (isWeb && resolvedRole === 'button' && !webNativeButton) {
    delete props.role
    deferredRole = 'button'
  } else {
    props.role ??= resolvedRole
  }

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
      pressableStyle = activeStyle ?? getDefaultStyle(style, 'active', variant, defaultActiveBg, defaultActiveOpacity)
    } else if (hover) {
      pressableStyle = hoverStyle ?? getDefaultStyle(style, 'hover', variant, defaultHoverBg, defaultHoverOpacity)
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

  return { props, pressableStyle, deferredRole }
}

function getDefaultStyle (
  style: StyleProp<ViewStyle>,
  type: 'hover' | 'active',
  variant?: 'opacity' | 'highlight',
  fallbackBackgroundColor?: string,
  opacity = 1
): StyleProp<ViewStyle> | undefined {
  if (variant === 'opacity') {
    if (type === 'hover' || type === 'active') return { opacity }
  } else {
    style = StyleSheet.flatten(style)
    let backgroundColor = style.backgroundColor
    if (backgroundColor === 'transparent') backgroundColor = undefined

    if (type === 'hover') {
      if (backgroundColor) {
        return { backgroundColor: getMixedColor(backgroundColor as string, opacity) ?? fallbackBackgroundColor }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: fallbackBackgroundColor }
      }
    }

    if (type === 'active') {
      if (backgroundColor) {
        return { backgroundColor: getMixedColor(backgroundColor as string, opacity) ?? fallbackBackgroundColor }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: fallbackBackgroundColor }
      }
    }
  }
}

function hasPressHandler (props: Record<string, any>): boolean {
  return PRESSABLE_PROPS.some(prop => props[prop])
}

function getMixedColor (backgroundColor: string, opacity: number): string | undefined {
  try {
    return getCssColor(backgroundColor, opacity)
  } catch {
    return undefined
  }
}

function toNumber (value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const number = Number(value)
    if (Number.isFinite(number)) return number
  }
  return fallback
}

function reverseMarginPaddingSides (style: ViewStyle | undefined): ViewStyle | undefined {
  if (!style) return style
  const { paddingLeft, paddingRight, marginLeft, marginRight } = style
  style.marginLeft = marginRight
  style.marginRight = marginLeft
  style.paddingLeft = paddingRight
  style.paddingRight = paddingLeft
  return style
}

function simpleNumericHash (s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
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

css`
  .root {
    outline-color: var(--color-ring);
  }

  .root.column.left {
    align-items: stretch;
  }

  .root.column.center {
    align-items: center;
  }

  .root.column.right {
    align-items: flex-end;
  }

  .root.column.v_top {
    justify-content: flex-start;
  }

  .root.column.v_center {
    justify-content: center;
  }

  .root.column.v_bottom {
    justify-content: flex-end;
  }

  .root.row {
    flex-direction: row;
  }

  .root.row.left {
    justify-content: flex-start;
  }

  .root.row.center {
    justify-content: center;
  }

  .root.row.right {
    justify-content: flex-end;
  }

  .root.row.between {
    justify-content: space-between;
  }

  .root.row.around {
    justify-content: space-around;
  }

  .root.row.v_start,
  .root.row.v_top {
    align-items: flex-start;
  }

  .root.row.v_center {
    align-items: center;
  }

  .root.row.v_end,
  .root.row.v_bottom {
    align-items: flex-end;
  }

  .root.row.v_stretch {
    align-items: stretch;
  }

  .root.wrap {
    flex-wrap: wrap;
  }

  .root.reverse.column {
    flex-direction: column-reverse;
  }

  .root.reverse.row {
    flex-direction: row-reverse;
  }

  .root.rounded {
    border-radius: var(--Div-radius);
  }

  .root.circle {
    border-radius: 9999px;
  }

  .root.pushed-s {
    margin-left: var(--Div-pushed-s);
  }

  .root.pushed-m {
    margin-left: var(--Div-pushed-m);
  }

  .root.pushed-l {
    margin-left: var(--Div-pushed-l);
  }

  .root.shadow-1 {
    box-shadow: var(--Div-shadow-1);
  }

  .root.shadow-2 {
    box-shadow: var(--Div-shadow-2);
  }

  .root.shadow-3 {
    box-shadow: var(--Div-shadow-3);
  }

  .root.shadow-4 {
    box-shadow: var(--Div-shadow-4);
  }

  .root.bleed {
    padding-left: var(--Div-bleed-x);
    padding-right: var(--Div-bleed-x);
    margin-left: calc(var(--Div-bleed-x) * -1);
    margin-right: calc(var(--Div-bleed-x) * -1);
  }

  .root.full {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .root.clickable {
    cursor: pointer;
    user-select: none;
  }

  .root.disabled {
    opacity: var(--Div-disabled-opacity);
    cursor: default;
  }
`
