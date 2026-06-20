import { openDialog } from './helpers'

export const _PropsJsonSchema = {/* ConfirmOptions */}

export interface ConfirmOptions {
  /** An optional dialog title displayed above the message */
  title?: string
  /** The message displayed inside the dialog */
  message: string
  /** Label for the cancel button */
  cancelLabel?: string
  /** Label for the confirm button */
  confirmLabel?: string
}

export default async function confirm (options: string | ConfirmOptions): Promise<boolean> {
  let title: unknown
  let message: unknown
  let cancelLabel: unknown
  let confirmLabel: unknown

  if (typeof options === 'string') {
    message = options
  } else if (options && typeof options === 'object') {
    title = (options as any).title
    message = (options as any).message
    cancelLabel = (options as any).cancelLabel
    confirmLabel = (options as any).confirmLabel
  }

  if (title != null && typeof title !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] confirm: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] confirm: message should be a string')
  }

  if (cancelLabel != null && typeof cancelLabel !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] confirm: cancelLabel should be a string')
  }

  if (confirmLabel != null && typeof confirmLabel !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] confirm: confirmLabel should be a string')
  }

  const normalizedTitle = typeof title === 'string' ? title : undefined
  const normalizedCancelLabel = typeof cancelLabel === 'string' ? cancelLabel : 'Cancel'
  const normalizedConfirmLabel = typeof confirmLabel === 'string' ? confirmLabel : 'OK'

  const result = await new Promise<boolean>(resolve => {
    openDialog({
      title: normalizedTitle,
      role: 'alertdialog',
      children: message,
      cancelLabel: normalizedCancelLabel,
      confirmLabel: normalizedConfirmLabel,
      showCross: false,
      enableBackdropPress: false,
      onCancel: () => { resolve(false) },
      onConfirm: () => { resolve(true) }
    })
  })

  return result
}
