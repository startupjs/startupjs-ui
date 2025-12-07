import { type ReactNode } from 'react'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import './index.cssx.styl'

const ICONS = {
  info: faInfoCircle,
  error: faExclamationCircle,
  warning: faExclamationTriangle,
  success: faCheckCircle
}

export default observer(themed('Alert', Alert))

export const _PropsJsonSchema = {/* AlertProps */}

export interface AlertProps extends Omit<DivProps, 'variant' | 'style'> {
  /** Custom styles applied to the root view */
  style?: DivProps['style']
  /** Alert visual style variant @default 'info' */
  variant?: 'info' | 'error' | 'warning' | 'success'
  /** Icon definition or toggle. Pass false to hide icon @default true */
  icon?: boolean | IconProps['icon']
  /** Title displayed above message */
  title?: string
  /** Deprecated alias for children @deprecated */
  label?: string
  /** Content rendered inside Alert */
  children?: ReactNode
  /** Custom actions renderer displayed at the end */
  renderActions?: () => ReactNode
  /** Close handler to render default close action */
  onClose?: () => void
}

function Alert ({
  style,
  variant = 'info',
  icon = true,
  label,
  title,
  renderActions,
  children,
  onClose,
  ...props
}: AlertProps): ReactNode {
  if (label) {
    children = label
    console.warn('[@startupjs/ui] Alert: label is DEPRECATED, use children instead.')
  }

  return pug`
    Div.root(
      style=style
      vAlign='center'
      styleName=[variant]
      row
      ...props
    )
      Div.information(row vAlign='center')
        if icon
          Icon.icon(
            icon=icon === true ? ICONS[variant] : icon
            size='l'
            styleName=[variant]
          )
        Div.content(styleName={ indent: icon !== false })
          if title
            Span(bold)= title
          if typeof children === 'string'
            Span= children
          else if Array.isArray(children) && children.every(item => typeof item === 'string')
            Span= children.join('')
          else
            = children
      if renderActions
        Div.actions
          = renderActions()
      else if onClose
        Div.actions(onPress=onClose)
          Icon.icon(
            icon=faTimes
            size='l'
            styleName=[variant]
          )
  `
}
