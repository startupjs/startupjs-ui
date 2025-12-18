import React from 'react'
import { pug, $ } from 'startupjs'
import TextInput from '../forms/TextInput'
import Br from '../Br'
import Span from '../typography/Span'
import { openDialog } from './helpers'

const $prompt = $()

export default async function prompt (options, defaultValue) {
  let title, message

  if (typeof options === 'string') {
    message = options
  } else {
    ({ title, message } = options || {})
    defaultValue = defaultValue || options?.defaultValue
  }

  if (title && typeof title !== 'string') {
    throw new Error('[@startupjs/ui] prompt: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] prompt: message should be a string')
  }

  const result = await new Promise(resolve => {
    $prompt.del()
    openDialog({
      title,
      value: defaultValue,
      children: pug`
        Span= message
        Br(half)
        TextInput(
          value=$prompt.get()
          onChangeText=text => $prompt.set(text)
        )
      `,
      showCross: false,
      enableBackdropPress: false,
      cancelLabel: 'Cancel',
      confirmLabel: 'OK',
      onCancel: () => {
        resolve(null)
      },
      onConfirm: () => {
        const result = $prompt.get()
        resolve(result)
      }
    })
  })

  return result
}
