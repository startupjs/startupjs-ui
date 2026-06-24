import { type ReactNode } from 'react'
import { css, pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'

const ICONS = {
  info: faInfoCircle,
  error: faExclamationCircle,
  warning: faExclamationTriangle,
  success: faCheckCircle
}

export default themed('Alert', observer(Alert))

export const _PropsJsonSchema = {/* AlertProps */}

export interface AlertProps extends Omit<DivProps, 'variant' | 'style'> {
  /** Custom styles applied to the root view */
  style?: DivProps['style']
  /** Custom styles applied to the information block */
  informationStyle?: DivProps['style']
  /** Custom styles applied to the icon */
  iconStyle?: IconProps['style']
  /** Custom styles applied to the content block */
  contentStyle?: DivProps['style']
  /** Custom styles applied to the actions block */
  actionsStyle?: DivProps['style']
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
      part='root'
      style=style
      vAlign='center'
      styleName=[variant]
      row
      ...props
    )
      Div.information(part='information' row vAlign='center')
        if icon
          Icon.icon(
            part='icon'
            icon=icon === true ? ICONS[variant] : icon
            size='l'
            styleName=[variant]
          )
        Div.content(part='content' styleName={ indent: icon !== false })
          if title
            Span(bold)= title
          if typeof children === 'string'
            Span= children
          else if Array.isArray(children) && children.every(item => typeof item === 'string')
            Span= children.join('')
          else
            = children
      if renderActions
        Div.actions(part='actions')
          = renderActions()
      else if onClose
        Div.actions(part='actions' onPress=onClose)
          Icon.icon(
            part='icon'
            icon=faTimes
            size='l'
            styleName=[variant]
      )
  `
}

css`
  .root {
    padding: var(--Alert-padding-y) var(--Alert-padding-x);
    border-width: var(--Alert-border-width);
    justify-content: space-between;
    border-radius: var(--Alert-radius);
  }

  .root.info {
    border-color: var(--Alert-info-border-color);
    background-color: var(--Alert-info-bg);
  }

  .root.error {
    border-color: var(--Alert-error-border-color);
    background-color: var(--Alert-error-bg);
  }

  .root.warning {
    border-color: var(--Alert-warning-border-color);
    background-color: var(--Alert-warning-bg);
  }

  .root.success {
    border-color: var(--Alert-success-border-color);
    background-color: var(--Alert-success-bg);
  }

  .information {
    padding-top: 2px;
    padding-bottom: 2px;
    flex-shrink: 1;
  }

  .icon {
    flex-shrink: 0;
  }

  .icon.info {
    color: var(--Alert-info-icon-color);
  }

  .icon.error {
    color: var(--Alert-error-icon-color);
  }

  .icon.warning {
    color: var(--Alert-warning-icon-color);
  }

  .icon.success {
    color: var(--Alert-success-icon-color);
  }

  .content {
    flex-shrink: 1;
  }

  .content.indent {
    margin-left: var(--Alert-content-indent);
  }

  .actions {
    flex-shrink: 0;
    margin-left: var(--Alert-actions-gap);
  }
`
