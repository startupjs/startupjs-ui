import { type ReactNode } from 'react'
import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Avatar, { type AvatarProps } from '@startupjs-ui/avatar'
import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'

export default observer(themed('User', User))

export const _PropsJsonSchema = {/* UserProps */} // used in docs generation

export interface UserProps extends DivProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the avatar */
  avatarStyle?: AvatarProps['style']
  /** Custom styles applied to the text wrapper */
  userInfoStyle?: StyleProp<ViewStyle>
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
  avatarStyle,
  userInfoStyle,
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
      part='root'
      style=style
      styleName=[avatarPosition]
      ...props
    )
      Avatar.avatar(
        part='avatar'
        style=avatarStyle
        styleName=[avatarPosition]
        size=size
        status=status
        src=avatarUrl
        statusComponents=statusComponents
      )= name
      View.userInfo(part='userInfo' style=userInfoStyle)
        Span.name(
          part='name'
          style=nameStyle
          styleName=[size, avatarPosition]
          numberOfLines=1
          bold
        )= name
        if description
          Span.description(
            part='description'
            style=descriptionStyle
            styleName=[size, avatarPosition]
            numberOfLines=descriptionNumberOfLines
            description
          )= description
  `
}

css`
  .root {
    flex-direction: row;
    align-items: center;
  }

  .root.right {
    flex-direction: row-reverse;
  }

  .avatar.left {
    margin-right: var(--User-avatar-gap);
  }

  .avatar.right {
    margin-left: var(--User-avatar-gap);
  }

  .userInfo {
    flex-shrink: 1;
  }

  .name.right,
  .description.right {
    text-align: right;
  }

  .name.s,
  .name.m {
    font-size: var(--User-name-font-size-m);
    line-height: var(--User-name-line-height-m);
  }

  .name.l {
    font-size: var(--User-name-font-size-l);
    line-height: var(--User-name-line-height-l);
  }

  .description.s,
  .description.m {
    font-size: var(--User-description-font-size-m);
    line-height: var(--User-description-line-height-m);
  }

  .description.l {
    font-size: var(--User-description-font-size-l);
    line-height: var(--User-description-line-height-l);
  }
`
