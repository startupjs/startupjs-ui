import React, { useId, type ReactNode, type ComponentType } from 'react'
import { View, TouchableOpacity, type StyleProp, type ViewStyle, type ViewProps } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions, { DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL } from './ModalActions'

function getTextFromChildren (children: ReactNode): string | undefined {
  if (children == null || typeof children === 'boolean') return undefined
  if (typeof children === 'string' || typeof children === 'number') {
    const text = String(children).trim()
    return text || undefined
  }
  if (Array.isArray(children)) {
    const parts = children
      .map(getTextFromChildren)
      .filter((part): part is string => !!part)
    return parts.length ? parts.join(' ').trim() : undefined
  }
  if (React.isValidElement(children)) {
    return getTextFromChildren((children as any).props?.children)
  }
  return undefined
}

export interface ModalLayoutProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the modal backdrop */
  overlayStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the modal surface */
  modalStyle?: StyleProp<ViewStyle>
  /** Children rendered inside modal sections */
  children?: ReactNode
  /** Layout variant @default 'window' */
  variant?: 'window' | 'fullscreen'
  /** Title rendered when no custom header provided */
  title?: string
  /** Accessible role for the modal surface on web @default 'dialog' */
  role?: ViewProps['role']
  /** Test identifier for the modal surface */
  testID?: string
  /** DEPRECATED: use cancelLabel instead */
  dismissLabel?: string
  /** Cancel action label @default 'Cancel' */
  cancelLabel?: string
  /** Confirm action label @default 'Confirm' */
  confirmLabel?: string
  /** Component used to wrap modal content */
  ModalElement?: ComponentType<any>
  /** Show cross button in header */
  showCross?: boolean
  /** Enable closing modal by tapping backdrop */
  enableBackdropPress?: boolean
  /** Request close handler */
  onRequestClose?: () => void
  /** Cross press handler */
  onCrossPress?: (event: any) => void | Promise<void>
  /** Backdrop press handler */
  onBackdropPress?: (event: any) => void | Promise<void>
  /** Cancel action handler */
  onCancel?: (event: any) => void | Promise<void>
  /** Confirm action handler */
  onConfirm?: (event: any) => void | Promise<void>
}

function Modal ({
  style,
  overlayStyle,
  modalStyle,
  children,
  variant,
  title,
  role,
  testID,
  dismissLabel,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  ModalElement,
  showCross,
  enableBackdropPress,
  onRequestClose,
  onCrossPress,
  onBackdropPress,
  onCancel,
  onConfirm
}: ModalLayoutProps): ReactNode {
  // DEPRECATED
  if (dismissLabel) {
    console.warn(
      '[@startupjs/ui] Modal: dismissLabel is DEPRECATED, use cancelLabel instead'
    )
    cancelLabel = dismissLabel
  }

  // Deconstruct template variables
  let header: ReactNode | undefined
  let actions: ReactNode | undefined
  let content: ReactNode | undefined
  const contentChildren: ReactNode[] = []

  React.Children.forEach(children, child => {
    if (!child) return

    switch ((child as any).type) {
      case ModalHeader:
        if (header) throw Error('[ui -> Modal] You must specify a single <Modal.Header>')
        header = child
        break
      case ModalActions:
        if (actions) throw Error('[ui -> Modal] You must specify a single <Modal.Actions>')
        actions = child
        break
      case ModalContent:
        if (content) throw Error('[ui -> Modal] You must specify a single <Modal.Content>')
        content = child
        break
      default:
        contentChildren.push(child)
    }
  })

  if (content && contentChildren.length > 0) {
    throw Error('[ui -> Modal] React elements found directly within <Modal>. ' +
      'If <Modal.Content> is specified, you have to put all your content inside it')
  }

  let _onConfirm
  let _onCancel
  const isWindowLayout = variant === 'window'
  const hasActions = !!onCancel || !!onConfirm
  const hasHeader = !!title || !!showCross
  const headerTitle = !title && React.isValidElement(header)
    ? getTextFromChildren((header as any).props?.children)
    : undefined
  const dialogTitle = title ?? headerTitle

  const _onCrossPress = async (event: any) => {
    event.persist() // TODO: remove in react 17
    const promise: any = onCrossPress?.(event)
    if (promise && typeof promise.then === 'function') await promise
    if (event.defaultPrevented) return
    if (onRequestClose) onRequestClose()
  }

  const _onBackdropPress = async (event: any) => {
    event.persist() // TODO: remove in react 17
    const promise: any = onBackdropPress?.(event)
    if (promise && typeof promise.then === 'function') await promise
    if (event.defaultPrevented) return
    if (onRequestClose) onRequestClose()
  }

  if (onConfirm) {
    _onConfirm = async (event: any) => {
      event.persist() // TODO: remove in react 17
      const promise: any = onConfirm(event)
      if (promise && typeof promise.then === 'function') await promise
      if (event.defaultPrevented) return
      if (onRequestClose) onRequestClose()
    }
  }

  if (hasActions) {
    _onCancel = async (event: any) => {
      event.persist() // TODO: remove in react 17
      const promise: any = onCancel?.(event)
      if (promise && typeof promise.then === 'function') await promise
      if (event.defaultPrevented) return
      if (onRequestClose) onRequestClose()
    }
  }

  if (!onConfirm && cancelLabel === DEFAULT_CANCEL_LABEL) {
    cancelLabel = 'OK'
  }

  const headerChildren = header && React.isValidElement(header)
    ? (header as any).props?.children
    : undefined
  const hasStringHeaderChildren = typeof headerChildren === 'string'
  const modalTitleId = useId()
  const titleId = dialogTitle && (title || hasStringHeaderChildren) ? modalTitleId : undefined

  // Handle <Modal.Header>
  const headerProps = {
    onCrossPress: showCross ? _onCrossPress : undefined,
    titleId
  }

  header = header
    ? React.cloneElement(header as any, { ...headerProps, ...(header as any).props })
    : hasHeader
      ? React.createElement(ModalHeader as any, headerProps, title)
      : null

  // Handle <Modal.Actions>
  const actionsProps = {
    cancelLabel,
    confirmLabel,
    onCancel: _onCancel,
    onConfirm: _onConfirm
  }

  actions = actions
    ? React.cloneElement(actions as any, { ...actionsProps, ...(actions as any).props })
    : hasActions
      ? React.createElement(ModalActions as any, actionsProps)
      : null

  // Handle <Modal.Content>
  const contentStyle: StyleProp<ViewStyle> = {}

  if (header) contentStyle.paddingTop = 0
  if (actions) contentStyle.paddingBottom = 0

  const contentProps = { variant, style: contentStyle }

  // content part should always present
  content = content
    ? React.cloneElement(content as any, { ...contentProps, ...(content as any).props })
    : React.createElement(ModalContent as any, contentProps, contentChildren)

  return pug`
    View.root(
      part='root'
      style=style
      styleName=[variant]
    )
      if isWindowLayout
        TouchableOpacity.overlay(
          part='overlay'
          activeOpacity=1
          style=overlayStyle
          onPress=enableBackdropPress ? _onBackdropPress : undefined
        )
      ModalElement.modal(
        part='modal'
        style=modalStyle
        styleName=[variant]
        role=role ?? 'dialog'
        testID=testID
        aria-modal
        aria-label=dialogTitle
        aria-labelledby=titleId
      )
        = header
        = content
        = actions
  `
}

export default themed('Modal', observer(Modal))

css`
  .root {
    height: 100%;
  }

  .root.window {
    padding-left: var(--Modal-window-gutter);
    padding-right: var(--Modal-window-gutter);
  }

  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--Modal-overlay-bg);
    cursor: pointer;
  }

  .modal {
    flex-shrink: 1;
    background-color: var(--Modal-bg);
  }

  .modal.window {
    margin: auto;
    max-height: var(--Modal-window-max-height);
    max-width: var(--Modal-window-max-width);
    min-width: var(--Modal-window-min-width);
    border-radius: var(--Modal-radius);
    box-shadow: var(--Modal-shadow);
  }

  .modal.fullscreen {
    height: 100%;
  }
`
