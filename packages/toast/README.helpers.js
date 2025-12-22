import { Fragment } from 'react'
import { pug } from 'startupjs'
import Button from '@startupjs-ui/button'
import Br from '@startupjs-ui/br'
import Div from '@startupjs-ui/div'
import Toast from './ToastView'
import { toast } from './index'

const BASE_TOAST_PROPS = {
  show: true,
  topPosition: 0,
  height: 72,
  type: 'info',
  title: 'Info',
  text: 'Note archived',
  actionLabel: 'View',
  onAction: () => {}
}

export function ToastProviderSandbox () {
  function onPressInfo () {
    toast({ text: 'Note archived' })
  }

  function onPressSuccess () {
    toast({ type: 'success', title: 'Success', text: 'Profile saved' })
  }

  function onPressAlert () {
    toast({ type: 'error', title: 'Error', text: 'Something went wrong', alert: true })
  }

  return pug`
    Fragment
      Button(onPress=onPressInfo) Show info toast
      Br
      Button(onPress=onPressSuccess) Show success toast
      Br
      Button(onPress=onPressAlert) Show alert toast
  `
}

export function ToastFunctionSandbox ({
  alert,
  icon,
  text,
  type,
  title,
  actionLabel
}) {
  function onPress () {
    toast({
      alert,
      icon,
      text,
      type,
      title,
      actionLabel
    })
  }

  return pug`
    Fragment
      Button(onPress=onPress) Show toast
  `
}

export function ToastComponentSandbox (props) {
  const onLayout = () => {}
  const mergedProps = { ...BASE_TOAST_PROPS, ...props }

  return pug`
    Div(style={ position: 'relative', minHeight: 120 })
      Toast(...mergedProps onLayout=onLayout)
  `
}
