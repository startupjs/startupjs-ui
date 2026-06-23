import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Animated } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'
import Button from '@startupjs-ui/button'
import Div from '@startupjs-ui/div'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'

const DURATION_OPEN = 300
const DURATION_CLOSE = 150

const ICONS = {
  info: faInfoCircle,
  error: faExclamationCircle,
  warning: faExclamationTriangle,
  success: faCheckCircle
}

const TITLES = {
  info: 'Info',
  error: 'Error',
  warning: 'Warning',
  success: 'Success'
}

export const _PropsJsonSchema = {/* ToastProps */}

export interface ToastProps {
  /** Visual style variant @default 'info' */
  type?: 'info' | 'error' | 'warning' | 'success'
  /** Y offset used to stack multiple toasts */
  topPosition: number
  /** Current toast height for stacking calculations */
  height?: number
  /** Controls whether the toast is visible */
  show: boolean
  /** Custom icon shown next to the title */
  icon?: IconProps['icon']
  /** Body text displayed under the title */
  text?: string
  /** Title text displayed in the header */
  title?: string
  /** Action button label displayed below the text @default 'View' */
  actionLabel?: string
  /** Action button press handler */
  onAction?: () => void
  /** Test identifier for the toast surface */
  testID?: string
  /** Called after the toast is closed and removed */
  onClose?: () => void
  /** Layout callback used to measure toast height */
  onLayout: (layout: { height: number }) => void
}

function Toast ({
  type = 'info',
  topPosition,
  height,
  show,
  icon,
  text,
  title,
  actionLabel = 'View',
  onAction,
  testID,
  onClose,
  onLayout
}: ToastProps): ReactNode {
  const [showAnimation] = useState(() => new Animated.Value(0))
  const [topAnimation] = useState(() => new Animated.Value(topPosition))

  const onShow = useCallback(() => {
    Animated
      .timing(showAnimation, { toValue: 1, duration: DURATION_OPEN, useNativeDriver: false })
      .start()
  }, [showAnimation])

  const onHide = useCallback(() => {
    Animated
      .timing(showAnimation, { toValue: 0, duration: DURATION_CLOSE, useNativeDriver: false })
      .start(onClose)
  }, [onClose, showAnimation])

  useEffect(() => {
    Animated
      .timing(topAnimation, { toValue: topPosition, duration: DURATION_OPEN, useNativeDriver: false })
      .start()
  }, [topPosition, topAnimation])

  useEffect(() => {
    if (show && height) onShow()
    if (!show) onHide()
  }, [height, onHide, onShow, show])

  return pug`
    Animated.View.root(
      part='root'
      style={
        opacity: showAnimation,
        right: showAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-48, 0]
        }),
        top: topAnimation
      }
      onLayout=e => onLayout(e.nativeEvent.layout)
      testID=testID
    )
      Div.toast(part='toast' styleName=[type])
        Div.header(part='header' vAlign='center' row)
          Div(part='titleWrapper' vAlign='center' row)
            Icon.icon(
              part='icon'
              icon=icon ?? ICONS[type]
              styleName=[type]
            )
            Span.title(part='title' styleName=[type])
              = title ? title : TITLES[type]
          Div(part='close' onPress=onHide)
            Icon(part='closeIcon' icon=faTimes)

        if text
          Span.text(part='text')= text

        if onAction
          Div.actions(part='actions' row)
            Button(
              part='action'
              size='s'
              onPress=() => {
                onAction()
                onHide()
              }
            )= actionLabel
  `
}

export default observer(themed('Toast', Toast))

css`
  .root {
    position: absolute;
    width: 100%;
  }

  @media (--breakpoint-tablet) {
    .root {
      max-width: var(--Toast-max-width);
      min-width: var(--Toast-min-width);
      padding-right: var(--Toast-screen-padding);
      padding-top: var(--Toast-screen-padding);
    }
  }

  .toast {
    padding: var(--Toast-padding);
    justify-content: center;
    border-radius: var(--Toast-radius);
    background-color: var(--Toast-bg);
    border-top-width: var(--Toast-border-width);
    border-top-style: solid;
    box-shadow: var(--Toast-shadow);
  }

  .toast.info {
    border-top-color: var(--Toast-info-color);
  }

  .toast.error {
    border-top-color: var(--Toast-error-color);
  }

  .toast.warning {
    border-top-color: var(--Toast-warning-color);
  }

  .toast.success {
    border-top-color: var(--Toast-success-color);
  }

  .header {
    justify-content: space-between;
  }

  .text {
    margin-top: var(--Toast-text-gap);
  }

  .title {
    margin-left: var(--Toast-title-gap);
  }

  .title.info,
  .icon.info {
    color: var(--Toast-info-color);
  }

  .title.error,
  .icon.error {
    color: var(--Toast-error-color);
  }

  .title.warning,
  .icon.warning {
    color: var(--Toast-warning-color);
  }

  .title.success,
  .icon.success {
    color: var(--Toast-success-color);
  }

  .actions {
    margin-top: var(--Toast-actions-gap);
    justify-content: flex-end;
  }
`
