import React, { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Button from '@startupjs-ui/button'

export const DEFAULT_CANCEL_LABEL = 'Cancel'
export const DEFAULT_CONFIRM_LABEL = 'Confirm'

export const _PropsJsonSchema = {/* ModalActionsProps */}

export interface ModalActionsProps {
  /** Custom styles applied to the actions container */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to each default action button */
  actionStyle?: StyleProp<ViewStyle>
  /** Custom actions content */
  children?: ReactNode
  /** Text for cancel button @default 'Cancel' */
  cancelLabel?: string
  /** Text for confirm button @default 'Confirm' */
  confirmLabel?: string
  /** Cancel button handler */
  onCancel?: (event: any) => void | Promise<void>
  /** Confirm button handler */
  onConfirm?: (event: any) => void | Promise<void>
  /** Test identifier */
  testID?: string
}

function ModalActions ({
  style,
  actionStyle,
  children,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  onCancel,
  onConfirm,
  testID
}: ModalActionsProps): ReactNode {
  return pug`
    Div.root(part='root' row style=style testID=testID align='right')
      if children
        = children
      else
        if onCancel
          Button.action(
            part='action'
            style=actionStyle
            color='primary'
            data-part='cancel'
            onPress=onCancel
          )= cancelLabel
        if onConfirm
          Button.action(
            part='action'
            style=actionStyle
            color='primary'
            variant='flat'
            data-part='confirm'
            onPress=onConfirm
          )= confirmLabel
  `
}

export default observer(themed('ModalActions', ModalActions))

css`
  .root {
    padding: var(--Modal-section-padding);
  }

  .action {
    margin-left: var(--Modal-action-gap);
  }
`
