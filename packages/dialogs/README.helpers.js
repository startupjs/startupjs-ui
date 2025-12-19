import { Fragment, useState } from 'react'
import { pug } from 'startupjs'
import Button from '@startupjs-ui/button'
import Br from '@startupjs-ui/br'
import Span from '@startupjs-ui/span'
import { alert, confirm, prompt } from './index'

export function DialogsProviderSandbox () {
  async function onPressAlert () {
    await alert({ title: 'Alert', message: 'I am an alert box' })
  }

  async function onPressConfirm () {
    await confirm({ title: 'Confirm', message: 'Press a button' })
  }

  async function onPressPrompt () {
    await prompt({ title: 'Prompt', message: 'Please enter your name', defaultValue: 'Paha' })
  }

  return pug`
    Fragment
      Button(onPress=onPressAlert) Show alert
      Br
      Button(onPress=onPressConfirm) Show confirm
      Br
      Button(onPress=onPressPrompt) Show prompt
  `
}

export function AlertSandbox ({ title, message }) {
  async function onPress () {
    await alert({ title, message })
  }

  return pug`
    Fragment
      Button(onPress=onPress) Show alert
  `
}

export function ConfirmSandbox ({ title, message }) {
  const [pressedButtonText, setPressedButtonText] = useState()

  async function onPress () {
    const isConfirmed = await confirm({ title, message })
    setPressedButtonText(isConfirmed ? 'OK' : 'Cancel')
  }

  return pug`
    Fragment
      Button(onPress=onPress) Show confirm
      if pressedButtonText
        Br
        Span= 'You pressed ' + pressedButtonText + '!'
  `
}

export function PromptSandbox ({ title, message, defaultValue }) {
  const [result, setResult] = useState()

  async function onPress () {
    const next = await prompt({ title, message, defaultValue })
    setResult(next)
  }

  return pug`
    Fragment
      Button(onPress=onPress) Show prompt
      if result != null
        Br
        Span= result === '' ? 'Empty input' : 'You typed: ' + result
  `
}
