import { openDialog } from './helpers'

export const _PropsJsonSchema = {/* AlertOptions */}

export interface AlertOptions {
  /** An optional dialog title displayed above the message */
  title?: string
  /** The message displayed inside the dialog */
  message: string
}

export default async function alert (options: string | AlertOptions): Promise<void> {
  let title: unknown
  let message: unknown

  if (typeof options === 'string') {
    message = options
  } else if (options && typeof options === 'object') {
    title = (options as any).title
    message = (options as any).message
  }

  if (title != null && typeof title !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] alert: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] alert: message should be a string')
  }

  const normalizedTitle = typeof title === 'string' ? title : undefined

  await new Promise<void>(resolve => {
    openDialog({
      title: normalizedTitle,
      children: message,
      cancelLabel: 'OK',
      onCancel: () => { resolve() },
      showCross: false,
      enableBackdropPress: false
    })
  })
}
