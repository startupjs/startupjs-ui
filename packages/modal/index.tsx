import React, {
  useCallback,
  useImperativeHandle,
  type ReactNode,
  type ComponentType,
  type RefObject
} from 'react'
import { SafeAreaView, Modal as RNModal, type StyleProp, type ViewStyle, type ViewProps } from 'react-native'
import { pug, observer, $, themed } from 'startupjs'

import Portal from '@startupjs-ui/portal'
import Layout from './layout'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions, { DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL } from './ModalActions'

type SupportedOrientation =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape'
  | 'landscape-left'
  | 'landscape-right'

const SUPPORTED_ORIENTATIONS: SupportedOrientation[] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right'
]

export const _PropsJsonSchema = {/* ModalProps */}

export interface ModalProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the modal backdrop */
  overlayStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the modal content container */
  modalStyle?: StyleProp<ViewStyle>
  /** Content rendered inside the modal */
  children?: ReactNode
  /** Layout variant @default 'window' */
  variant?: 'window' | 'fullscreen'
  /** Controlled visibility flag */
  visible?: boolean
  /** Model binding for two-way visibility control */
  $visible?: any
  /** Imperative ref to open/close modal when not controlled */
  ref?: RefObject<any>
  /** Header title text */
  title?: string
  /** Accessible role for the modal surface on web @default 'dialog' */
  role?: ViewProps['role']
  /** Label for cancel action @default 'Cancel' */
  cancelLabel?: string
  /** Label for confirm action @default 'Confirm' */
  confirmLabel?: string
  /** Show a cross in the header @default true */
  showCross?: boolean
  /** Makes the backdrop clickable @default true */
  enableBackdropPress?: boolean
  /** Component used as modal container @default SafeAreaView */
  ModalElement?: ComponentType<any>
  /** Modal animation type @default 'fade' */
  animationType?: 'slide' | 'fade' | 'none'
  /** Render modal with transparent background @default true */
  transparent?: boolean
  /** Control status bar translucency on Android */
  statusBarTranslucent?: boolean
  /** Allowed screen orientations */
  supportedOrientations?: SupportedOrientation[]
  /** Test identifier for the modal surface */
  testID?: string
  /** Callback fired after modal becomes visible */
  onShow?: () => void
  /** Called when user clicks on the cross */
  onCrossPress?: (event: any) => void | Promise<void>
  /** Show only the one `OK` button that uses this handler */
  onCancel?: (event: any) => void | Promise<void>
  /** Show two buttons: `OK` uses this handler and `Cancel` uses the `onCancel` handler */
  onConfirm?: (event: any) => void | Promise<void>
  /** Called when the user clicks on the backdrop (requires enableBackdropPress to be true) */
  onBackdropPress?: (event: any) => void | Promise<void>
  /** Called when the orientation changes while the modal is displayed */
  onOrientationChange?: (event: any) => void
  /** Called when user requests to close the modal (hardware back, menu button, Esc, etc.). Also fired after cross/backdrop/cancel/confirm unless handlers call event.preventDefault() */
  onRequestClose?: (value?: boolean) => void
  /** Called once the modal has been dismissed */
  onDismiss?: () => void
  /** DEPRECATED: use onRequestClose instead */
  onChange?: (value?: boolean) => void
}

function ModalRoot ({
  style,
  overlayStyle,
  modalStyle,
  children,
  variant = 'window',
  visible,
  $visible,
  ref,
  title,
  role,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  showCross = true,
  enableBackdropPress = true,
  ModalElement = SafeAreaView,
  animationType = 'fade',
  transparent = true,
  supportedOrientations = SUPPORTED_ORIENTATIONS,
  statusBarTranslucent,
  testID,
  onChange, // DEPRECATED
  onRequestClose,
  onDismiss,
  onShow,
  onCrossPress,
  onBackdropPress,
  onCancel,
  onConfirm,
  onOrientationChange,
  ...props
}: ModalProps): ReactNode {
  if (onChange) {
    console.warn('[@startupjs/ui] Modal: onChange is DEPRECATED, use onRequestClose instead.')
  }

  const _$visible = $() // used for uncontrolled mode
  if (visible == null) {
    if ($visible) {
      visible = $visible.get()
    } else if (_$visible.get()) {
      visible = _$visible.get()
    }
  }

  // WORKAROUND
  // convert 'visible' to boolean
  // because modal window appears for undefined value on web
  visible = !!visible

  const _onRequestClose = useCallback(() => {
    onRequestClose?.()
    if ($visible) {
      $visible.del()
    } else {
      _$visible.del()
    }
  }, [onRequestClose, $visible, _$visible])

  useImperativeHandle(ref, () => ({
    open: () => {
      if ($visible) {
        $visible.set(true)
      } else {
        _$visible.set(true)
      }
    },
    close: () => {
      _onRequestClose()
    }
  }), [_onRequestClose, $visible, _$visible])

  return pug`
    RNModal(
      visible=visible
      transparent=transparent
      supportedOrientations=supportedOrientations
      animationType=animationType
      statusBarTranslucent=statusBarTranslucent
      onRequestClose=_onRequestClose
      onOrientationChange=onOrientationChange
      onShow=onShow
      onDismiss=onDismiss
      ...props
    )
      Portal.Provider
        if visible
          Layout(
            style=style
            overlayStyle=overlayStyle
            modalStyle=modalStyle
            variant=variant
            title=title
            role=role
            testID=testID
            cancelLabel=cancelLabel
            confirmLabel=confirmLabel
            showCross=showCross
            enableBackdropPress=enableBackdropPress
            ModalElement=ModalElement
            onRequestClose=_onRequestClose
            onCrossPress=onCrossPress
            onBackdropPress=onBackdropPress
            onCancel=onCancel
            onConfirm=onConfirm
          )= children
  `
}

const ObservedModal = observer(themed('Modal', ModalRoot)) as any

ObservedModal.Header = ModalHeader
ObservedModal.Content = ModalContent
ObservedModal.Actions = ModalActions

export default ObservedModal
