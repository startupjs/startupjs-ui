import { openDialog } from './helpers'

export const _PropsJsonSchema = {/* ConfirmOptions */}

export interface ConfirmOptions {
  /** An optional dialog title displayed above the message */
  title?: string
  /** The message displayed inside the dialog */
  message: string
}

export default async function confirm (options: string | ConfirmOptions): Promise<boolean> {
  let title: unknown
  let message: unknown

  if (typeof options === 'string') {
    message = options
  } else if (options && typeof options === 'object') {
    title = (options as any).title
    message = (options as any).message
  }

  if (title != null && typeof title !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] confirm: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] confirm: message should be a string')
  }

  const normalizedTitle = typeof title === 'string' ? title : undefined

  const result = await new Promise<boolean>(resolve => {
    openDialog({
      title: normalizedTitle,
      children: message,
      cancelLabel: 'Cancel',
      confirmLabel: 'OK',
      showCross: false,
      enableBackdropPress: false,
      onCancel: () => { resolve(false) },
      onConfirm: () => { resolve(true) }
    })
  })

  return result
}
