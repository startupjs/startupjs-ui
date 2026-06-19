import { Children, isValidElement, useMemo, useRef, useCallback, useImperativeHandle, type ReactNode, type RefObject } from 'react'
import { View, TouchableWithoutFeedback, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, useBind, $ } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import AbstractPopover, { type AbstractPopoverProps } from '@startupjs-ui/abstract-popover'
import Div from '@startupjs-ui/div'
import './index.cssx.styl'

export const _PropsJsonSchema = {/* PopoverProps */}

export interface PopoverProps extends Omit<AbstractPopoverProps, 'anchorRef' | 'children' | 'style' | 'visible'> {
  /** Ref to control popover programmatically */
  ref?: RefObject<PopoverRef>
  /** Custom styles for the anchor wrapper */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the popover container */
  attachmentStyle?: StyleProp<ViewStyle>
  /** Custom styles for the dismiss overlay */
  overlayStyle?: StyleProp<ViewStyle>
  /** Controlled visibility flag */
  visible?: boolean
  /** Two-way binding value controlling visibility */
  $visible?: any
  /** Called when visibility should change */
  onChange?: (visible: boolean) => void
  /** Called when popover finishes closing */
  onDismiss?: () => void
  /** Open the popover when the anchor wrapper is pressed @default true */
  openOnAnchorPress?: boolean
  /** Anchor content */
  children?: ReactNode
  /** Render function for popover content */
  renderContent?: () => ReactNode
}

export interface PopoverRef {
  /** Open the popover */
  open: () => void
  /** Close the popover */
  close: () => void
}

function Popover ({
  style,
  attachmentStyle,
  visible,
  $visible,
  children,
  renderContent,
  onChange,
  onCloseComplete,
  onDismiss,
  openOnAnchorPress = true,
  renderWrapper,
  overlayStyle,
  ref,
  ...props
}: PopoverProps): ReactNode {
  const anchorRef = useRef<any>(null)

  const isUncontrolled = useMemo(() => {
    const isUsedViaTwoWayDataBinding = typeof $visible !== 'undefined'
    const isUsedViaState = typeof onChange === 'function'
    return !(isUsedViaTwoWayDataBinding || isUsedViaState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const $internalVisible = $(false)
  const $effectiveVisible = isUncontrolled ? $internalVisible : $visible

  ;({ visible, onChange } = useBind({ visible, $visible: $effectiveVisible, onChange }) as any)

  const handleChange = useCallback((nextVisible: boolean) => {
    if (typeof onChange === 'function') {
      onChange(nextVisible)
      return
    }
    if ($effectiveVisible) {
      $effectiveVisible.set(nextVisible)
      return
    }
    $internalVisible.set(nextVisible)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({
    open: () => { handleChange(true) },
    close: () => { handleChange(false) }
  }), [handleChange])

  const setVisibleTrue = useCallback(() => { handleChange(true) }, [handleChange])
  const setVisibleFalse = useCallback(() => { handleChange(false) }, [handleChange])
  const handleCloseComplete = useCallback((...args: any[]) => {
    onCloseComplete?.(...args)
    onDismiss?.()
  }, [onCloseComplete, onDismiss])
  const shouldOpenOnAnchorPress = useMemo(() => {
    if (!openOnAnchorPress) return false

    const childArray = Children.toArray(children)
    if (childArray.length !== 1) return true

    const child = childArray[0]
    if (!isValidElement<{ onPress?: unknown }>(child)) return true

    return typeof child.props.onPress !== 'function'
  }, [children, openOnAnchorPress])

  const renderOverlayWrapper = (node: ReactNode): ReactNode => {
    const wrappedNode = renderWrapper ? renderWrapper(node) : node
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=setVisibleFalse)
          View.overlay(style=overlayStyle)
        = wrappedNode
    `
  }

  return pug`
    Div(
      style=style
      ref=anchorRef
      onPress=shouldOpenOnAnchorPress ? setVisibleTrue : null
    )= children
    AbstractPopover.attachment(
      ...props
      visible=visible
      style=[attachmentStyle]
      anchorRef=anchorRef
      renderWrapper=renderOverlayWrapper
      onCloseComplete=handleCloseComplete
    )= renderContent && renderContent()
  `
}

export default observer(themed('Popover', Popover))
