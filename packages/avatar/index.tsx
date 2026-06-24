import { useState, type ComponentType, type ReactNode } from 'react'
import { Image, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssVariable, useDidUpdate, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import randomcolor from 'randomcolor'

const DEFAULT_STATUSES = ['online', 'away']

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export default themed('Avatar', observer(Avatar))

export const _PropsJsonSchema = {/* AvatarProps */}

export interface AvatarProps extends DivProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the avatar wrapper */
  wrapperStyle?: StyleProp<ViewStyle>
  /** Custom styles applied to the image or fallback background */
  imageStyle?: StyleProp<any>
  /** Custom styles applied to the fallback text */
  fallbackStyle?: StyleProp<any>
  /** Custom styles applied to the status indicator */
  statusStyle?: StyleProp<ViewStyle>
  /** Avatar image source URL */
  src?: string
  /** Size preset or explicit pixel value @default 'm' */
  size?: 's' | 'm' | 'l' | number
  /** Status indicator name */
  status?: 'online' | 'away' | string
  /** Avatar shape variant @default 'circle' */
  shape?: DivProps['shape']
  /** Text used to build fallback initials @default '?' */
  children?: string
  /** Custom components for status indicators keyed by status */
  statusComponents?: Record<string, ComponentType<any>>
}

function Avatar ({
  style,
  src,
  size = 'm',
  status,
  shape = 'circle',
  children = '?',
  statusComponents,
  disabled = false,
  ...props
}: AvatarProps): ReactNode {
  const [error, setError] = useState<boolean>()
  useDidUpdate(() => {
    setError(undefined)
  }, [src])

  const avatarSizes = {
    s: toNumber(useCssVariable('--Avatar-size-s', 32), 32),
    m: toNumber(useCssVariable('--Avatar-size-m', 40), 40),
    l: toNumber(useCssVariable('--Avatar-size-l', 48), 48)
  }
  const statusSizes = {
    s: toNumber(useCssVariable('--Avatar-status-size-s', 10), 10),
    m: toNumber(useCssVariable('--Avatar-status-size-m', 12), 12),
    l: toNumber(useCssVariable('--Avatar-status-size-l', 14), 14)
  }
  const fallbackSizes = {
    s: toNumber(useCssVariable('--Avatar-fallback-size-s', 12), 12),
    m: toNumber(useCssVariable('--Avatar-fallback-size-m', 14), 14),
    l: toNumber(useCssVariable('--Avatar-fallback-size-l', 16), 16)
  }

  const _size = typeof size === 'string' ? avatarSizes[size] : size
  const _rootStyle = { width: _size, height: _size }
  const _statusSize = typeof size === 'string' ? statusSizes[size] : Math.round(Number(size) / 4)
  const _statusStyle = { width: _statusSize, height: _statusSize }
  const _fallbackFontSize = typeof size === 'string'
    ? fallbackSizes[size]
    : Math.round(Number(size) / 2.5)
  const _fallbackStyle = { fontSize: _fallbackFontSize, lineHeight: _fallbackFontSize }

  const StatusComponent = getStatusComponent(statusComponents, status)

  return pug`
    Div.root(
      part='root'
      style=[_rootStyle, style]
      disabled=disabled
      ...props
    )
      Div.avatarWrapper(part='wrapper' shape=shape)
        if src && !error
          Image.avatar(
            part='image'
            source={ uri: src }
            onError=() => {
              setError(true)
            }
          )
        else
          - const _fallback = children.trim()
          - const [firstName, lastName] = _fallback.split(' ')
          - const initials = (firstName ? firstName[0].toUpperCase() : '') + (lastName ? lastName[0].toUpperCase() : '')
          Div.avatar(part='image'
            style={
              backgroundColor: randomcolor({
                luminosity: 'bright',
                seed: _fallback
              }) as string
            }
          )
            Span.fallback(part='fallback' bold style=_fallbackStyle)
              = initials
      if status
        StatusComponent.status(part='status' styleName=[status, shape] style=_statusStyle)
  `
}

function getStatusComponent (
  statusComponents?: AvatarProps['statusComponents'],
  status?: AvatarProps['status']
) {
  if (!status) return Div

  if (!DEFAULT_STATUSES.includes(status) && !statusComponents?.[status]) {
    console.error(
      "[@dmapper/ui -> Avatar] Custom component for status '" +
        status +
        "' is not specified. Use 'statusComponents' to specify it."
    )
  }
  return statusComponents?.[status] ?? Div
}

css`
  .root {
    user-select: none;
  }

  .avatarWrapper {
    height: 100%;
    overflow: hidden;
  }

  .avatar {
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .fallback {
    color: var(--Avatar-fallback-color);
  }

  .status {
    position: absolute;
    z-index: 1;
    border-width: var(--Avatar-status-border-width);
    border-color: var(--Avatar-status-border-color);
    border-radius: var(--Avatar-status-radius);
  }

  .status.circle {
    right: 0;
    bottom: 0;
  }

  .status.squared,
  .status.rounded {
    bottom: var(--Avatar-status-offset);
    right: var(--Avatar-status-offset);
  }

  .status.online {
    background-color: var(--Avatar-status-online-bg);
  }

  .status.away {
    background-color: var(--Avatar-status-away-bg);
  }
`
