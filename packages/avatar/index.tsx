import { useState, type ComponentType, type ReactNode } from 'react'
import { Image, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import randomcolor from 'randomcolor'
import STYLES from './index.cssx.styl'

const { config } = STYLES

const DEFAULT_STATUSES = ['online', 'away']

export default observer(themed('Avatar', Avatar))

export const _PropsJsonSchema = {/* AvatarProps */}

export interface AvatarProps extends DivProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
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

  const _size = config.avatarSizes?.[size] ?? size
  const _rootStyle = { width: _size, height: _size }
  const _statusSize = config.statusSizes?.[size] ?? Math.round(Number(size) / 4)
  const _statusStyle = { width: _statusSize, height: _statusSize }
  const _fallbackFontSize = config.fallbackSizes?.[size] ?? Math.round(Number(size) / 2.5)
  const _fallbackStyle = { fontSize: _fallbackFontSize, lineHeight: _fallbackFontSize }

  const StatusComponent = getStatusComponent(statusComponents, status)

  return pug`
    Div.root(
      part='root'
      style=_rootStyle
      disabled=disabled
      ...props
    )
      Div.avatarWrapper(shape=shape)
        if src && !error
          Image.avatar(
            source={ uri: src }
            onError=() => {
              setError(true)
            }
          )
        else
          - const _fallback = children.trim()
          - const [firstName, lastName] = _fallback.split(' ')
          - const initials = (firstName ? firstName[0].toUpperCase() : '') + (lastName ? lastName[0].toUpperCase() : '')
          Div.avatar(
            style={backgroundColor: randomcolor({
              luminosity: 'bright',
              seed: _fallback
            })}
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
