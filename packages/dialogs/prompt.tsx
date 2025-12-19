import { type ReactNode } from 'react'
import { pug, $, observer } from 'startupjs'
import TextInput from '@startupjs-ui/text-input'
import Br from '@startupjs-ui/br'
import Span from '@startupjs-ui/span'
import { openDialog } from './helpers'

export const _PropsJsonSchema = {/* PromptOptions */}

export interface PromptOptions {
  /** An optional dialog title displayed above the message */
  title?: string
  /** The message displayed above the input field */
  message: string
  /** An optional initial value for the input field */
  defaultValue?: string
}

export default async function prompt (message: string, defaultValue?: string): Promise<string | null>
export default async function prompt (options: PromptOptions, defaultValue?: string): Promise<string | null>
export default async function prompt (options: string | PromptOptions, defaultValue?: string): Promise<string | null> {
  let title: unknown
  let message: unknown

  if (typeof options === 'string') {
    message = options
  } else if (options && typeof options === 'object') {
    title = (options as any).title
    message = (options as any).message
    defaultValue = defaultValue ?? (options as any).defaultValue
  }

  if (title != null && typeof title !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] prompt: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs-ui/dialogs] prompt: message should be a string')
  }

  const normalizedTitle = typeof title === 'string' ? title : undefined

  const result = await new Promise<string | null>(resolve => {
    const $prompt = $(defaultValue)

    openDialog({
      title: normalizedTitle,
      children: pug`
        Span= message
        Br(half)
        TextInputWrapper($prompt=$prompt)
      `,
      showCross: false,
      enableBackdropPress: false,
      cancelLabel: 'Cancel',
      confirmLabel: 'OK',
      onCancel: () => { resolve(null) },
      onConfirm: () => { resolve(($prompt.get() as string | undefined) ?? '') }
    })
  })

  return result
}

// We need to make an observable wrapper so that in auto-rerenders when signal changes
const TextInputWrapper = observer(({ $prompt }: { $prompt: any }): ReactNode => {
  return pug`
    TextInput(
      value=$prompt.get()
      onChangeText=text => $prompt.set(text)
    )
  `
})
