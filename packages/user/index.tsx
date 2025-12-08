import { type ReactNode } from 'react'
import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Avatar, { type AvatarProps } from '@startupjs-ui/avatar'
import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import './index.cssx.styl'

export default observer(themed('User', User))

export const _PropsJsonSchema = {/* UserProps */} // used in docs generation

export interface UserProps extends DivProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the name text */
  nameStyle?: StyleProp<TextStyle>
  /** Custom styles applied to the description text */
  descriptionStyle?: StyleProp<TextStyle>
  /** Avatar image source URL */
  avatarUrl?: string
  /** Additional description text below the name */
  description?: string
  /** Maximum number of lines for the description */
  descriptionNumberOfLines?: number
  /** User name displayed next to the avatar */
  name?: string
  /** Position of the avatar relative to text @default 'left' */
  avatarPosition?: 'left' | 'right'
  /** Size preset forwarded to avatar and texts @default 'm' */
  size?: 's' | 'm' | 'l'
  /** Status indicator name for the avatar */
  status?: 'online' | 'away' | string
  /** Custom components for avatar statuses */
  statusComponents?: AvatarProps['statusComponents']
}

function User ({
  style,
  nameStyle,
  descriptionStyle,
  avatarUrl,
  description,
  descriptionNumberOfLines,
  name,
  avatarPosition = 'left',
  size = 'm',
  status,
  statusComponents,
  ...props
}: UserProps): ReactNode {
  return pug`
    Div.root(
      style=style
      styleName=[avatarPosition]
      ...props
    )
      Avatar.avatar(
        styleName=[avatarPosition]
        size=size
        status=status
        src=avatarUrl
        statusComponents=statusComponents
      )= name
      View.userInfo
        Span.name(
          style=nameStyle
          styleName=[size, avatarPosition]
          numberOfLines=1
          bold
        )= name
        if description
          Span.description(
            style=descriptionStyle
            styleName=[size, avatarPosition]
            numberOfLines=descriptionNumberOfLines
            description
          )= description
  `
}
