import React, { useId, type ReactNode, type ComponentType } from 'react'
import { View, TouchableOpacity, type StyleProp, type ViewStyle, type ViewProps } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions, { DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL } from './ModalActions'
import './index.cssx.styl'

export interface ModalLayoutProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
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
  modalStyle,
  children,
  variant,
  title,
  role,
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
  const headerTitle = !title && React.isValidElement(header) && typeof (header as any).props?.children === 'string'
    ? (header as any).props.children as string
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

  const modalTitleId = useId()
  const titleId = dialogTitle ? modalTitleId : undefined

  // Handle <Modal.Header>
  const headerProps = {
    onCrossPress: showCross ? _onCrossPress : undefined,
    titleId
  }

  header = header
    ? React.cloneElement(header as any, { ...headerProps, ...(header as any).props })
    : hasHeader
      ? React.createElement(ModalHeader, headerProps, title)
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
      ? React.createElement(ModalActions, actionsProps)
      : null

  // Handle <Modal.Content>
  const contentStyle: StyleProp<ViewStyle> = {}

  if (header) contentStyle.paddingTop = 0
  if (actions) contentStyle.paddingBottom = 0

  const contentProps = { variant, style: contentStyle }

  // content part should always present
  content = content
    ? React.cloneElement(content as any, { ...contentProps, ...(content as any).props })
    : React.createElement(ModalContent, contentProps, contentChildren)

  return pug`
    View.root(
      style=style
      styleName=[variant]
    )
      if isWindowLayout
        TouchableOpacity.overlay(
          activeOpacity=1
          onPress=enableBackdropPress ? _onBackdropPress : undefined
        )
      ModalElement.modal(
        style=modalStyle
        styleName=[variant]
        role=role ?? 'dialog'
        aria-modal
        aria-label=titleId ? undefined : dialogTitle
        aria-labelledby=titleId
      )
        = header
        = content
        = actions
  `
}

export default observer(themed('Modal', Modal))
