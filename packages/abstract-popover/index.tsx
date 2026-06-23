import { useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from 'react'
import {
  Animated, Easing, Dimensions, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle
} from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Portal from '@startupjs-ui/portal'
import getGeometry, { type PopoverGeometry } from './getGeometry'
import {
  PLACEMENTS_ORDER,
  type AbstractPopoverAttachment as Attachment,
  type AbstractPopoverPlacement as Placement,
  type AbstractPopoverPosition as Position
} from './constants'

export const _PropsJsonSchema = {/* AbstractPopoverProps */}

export interface AbstractPopoverProps {
  /** Additional cssx styleName(s) for the popover root */
  styleName?: any
  /** Custom styles for popover container */
  style?: StyleProp<ViewStyle>
  /** Custom styles for popover arrow */
  arrowStyle?: StyleProp<ViewStyle>
  /** Ref to the anchor element (must support `measure`) */
  anchorRef: any
  /** Show/hide popover */
  visible?: boolean
  /** Primary position @default 'bottom' */
  position?: Position
  /** Attachment relative to anchor @default 'start' */
  attachment?: Attachment
  /** Ordered placements fallback list */
  placements?: readonly Placement[]
  /** Show arrow */
  arrow?: boolean
  /** Match popover width to anchor */
  matchAnchorWidth?: boolean
  /** Open animation duration (ms) @default 100 */
  durationOpen?: number
  /** Close animation duration (ms) @default 50 */
  durationClose?: number
  /** Wrap rendered popover node */
  renderWrapper?: (node: ReactNode) => ReactNode
  /** Called right before open animation starts */
  onRequestOpen?: () => void
  /** Called right before close animation starts */
  onRequestClose?: () => void
  /** Called after open animation ends */
  onOpenComplete?: (finished?: boolean) => void
  /** Called after close animation ends */
  onCloseComplete?: (finished?: boolean) => void
  /** Popover content */
  children?: ReactNode
  /** Stable test id for the popover surface (portal root) */
  testID?: string
}

function AbstractPopover ({
  visible: visibleProp,
  onCloseComplete,
  position = 'bottom',
  attachment = 'start',
  placements = PLACEMENTS_ORDER,
  arrow = false,
  matchAnchorWidth = false,
  durationOpen = 100,
  durationClose = 50,
  ...props
}: AbstractPopoverProps): ReactNode {
  const [visible, setVisible] = useState(false)
  const visiblePropRef = useRef(visibleProp)

  useEffect(() => {
    visiblePropRef.current = visibleProp
    if (visibleProp) setVisible(true)
  }, [visibleProp])

  const handleCloseComplete = useCallback((finished?: boolean) => {
    if (visiblePropRef.current) return

    setVisible(false)
    onCloseComplete?.(finished)
  }, [onCloseComplete])

  if (!visible) return null

  return pug`
    Tether(
      ...props
      visible=visibleProp
      position=position
      attachment=attachment
      placements=placements
      arrow=arrow
      matchAnchorWidth=matchAnchorWidth
      durationOpen=durationOpen
      durationClose=durationClose
      onCloseComplete=handleCloseComplete
    )
  `
}

const Tether = observer(function TetherComponent ({
  styleName,
  style,
  arrowStyle,
  anchorRef,
  visible,
  position = 'bottom',
  attachment = 'start',
  // IDEA: Is this property is redundant?
  // We can always find a better position if the specified position does not fit
  // Also we can use the same logic like in tether.io
  placements = PLACEMENTS_ORDER,
  arrow = false,
  matchAnchorWidth = false,
  durationOpen = 100,
  durationClose = 50,
  renderWrapper,
  onRequestOpen,
  onRequestClose,
  onOpenComplete,
  onCloseComplete,
  children,
  testID
}: AbstractPopoverProps): ReactNode {
  const flattenedStyle = StyleSheet.flatten(style) as ViewStyle | undefined
  if (!renderWrapper) renderWrapper = (node): ReactNode => node

  const [geometry, setGeometry] = useState<PopoverGeometry>()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const dimensions = useMemo(() => ({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }), [])

  const animateIn = useCallback(() => {
    onRequestOpen?.()

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: durationOpen,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      onOpenComplete?.(finished)
    })
  }, [durationOpen, fadeAnim, onOpenComplete, onRequestOpen])

  const animateOut = useCallback(() => {
    onRequestClose?.()

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: durationClose,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(({ finished }) => {
      onCloseComplete?.(finished)
    })
  }, [durationClose, fadeAnim, onCloseComplete, onRequestClose])

  useEffect(() => {
    if (!geometry) return
    if (visible) animateIn()
    else animateOut()
  }, [animateIn, animateOut, geometry, visible])

  const calculateGeometry = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    // IDEA: we can pass measures to this component
    // instead of passing ref for the measurement
    // Also, add property that will manage where popover should appear
    // in portal or in at the place where component is called
    // maybe use PortalProvider to render it in the place where component is called
    anchorRef?.current?.measure?.((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      // IDEA: rewrite getGeometry in future
      // we can make geometry behaviout like in tether.js
      const geometry = getGeometry({
        placement: `${position}-${attachment}` as Placement,
        placements,
        arrow,
        matchAnchorWidth,
        dimensions,
        tetherMeasures: nativeEvent.layout,
        anchorMeasures: { x, y, width, height, pageX, pageY }
      })
      setGeometry(geometry)
    })
  }, [anchorRef, arrow, attachment, dimensions, matchAnchorWidth, placements, position])

  // WORKAROUND
  // the minimum height fixes an issue where the 'onLayout' does not trigger
  // when children are undefined or have no size.
  const rootStyle: any = {
    top: geometry ? geometry.top : -99999,
    left: geometry ? geometry.left : -99999,
    opacity: fadeAnim,
    minHeight: 1
  }

  if (geometry) {
    rootStyle.width = geometry.width
  }

  const arrowColorStyle = {
    borderTopColor: flattenedStyle?.backgroundColor
  }
  const arrowGeometryStyle = geometry && {
    left: geometry.arrowLeft,
    top: geometry.arrowTop
  }

  const popover = pug`
    Animated.View.root(
      part='root'
      style=[flattenedStyle, rootStyle]
      styleName=styleName
      onLayout=calculateGeometry
      testID=testID
    )
      if arrow && !!geometry
        View.arrow(
          part='arrow'
          style=[arrowColorStyle, arrowStyle, arrowGeometryStyle]
          styleName=[geometry.position]
        )
      = children
  `

  return pug`
    Portal
      = renderWrapper(popover)
  `
})

export default themed('AbstractPopover', observer(AbstractPopover))

css`
  .root {
    position: absolute;
    z-index: var(--AbstractPopover-z-index);
  }

  .arrow {
    position: absolute;
    border-width: var(--AbstractPopover-arrow-size);
    border-style: solid;
    border-color: transparent;
  }

  .arrow.left {
    transform: rotate(-90deg);
  }

  .arrow.right {
    transform: rotate(90deg);
  }

  .arrow.bottom {
    transform: rotate(180deg);
  }
`
