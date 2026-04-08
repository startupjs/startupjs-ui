import { type ReactNode } from 'react'
import { pug, observer } from 'startupjs'
import Portal from '@startupjs-ui/portal'
import { $toasts } from './helpers'
import Toast, { type ToastProps } from './ToastView'

export const _PropsJsonSchema = {/* ToastProviderProps */}

export type ToastProviderProps = Record<string, any>

function ToastProvider (): ReactNode {
  const toasts = $toasts.get() as ToastProps[] | undefined

  if (!toasts?.length) return null

  return pug`
    Portal
      each toast in toasts
        Toast(...toast key=toast.key)
  `
}

export default observer(ToastProvider) as any
