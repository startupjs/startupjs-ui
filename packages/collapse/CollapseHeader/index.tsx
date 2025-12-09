import React, { useRef, type ReactNode } from 'react'
import { Animated, type StyleProp, type ViewStyle } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Icon, { type IconProps } from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import './index.cssx.styl'

export const _PropsJsonSchema = {/* CollapseHeaderProps */}

export interface CollapseHeaderProps {
  /** Custom styles applied to the root view */
  style?: StyleProp<ViewStyle>
  /** Custom styles applied to the icon */
  iconStyle?: IconProps['style']
  /** Custom styles applied to the content container */
  containerStyle?: StyleProp<ViewStyle>
  /** Header content */
  children?: ReactNode
  /** Collapse variant controlling paddings */
  variant?: 'full' | 'pure'
  /** Icon position relative to the title @default 'left' */
  iconPosition?: 'left' | 'right'
  /** Icon displayed in header; true uses default caret @default true */
  icon?: IconProps['icon'] | boolean
  /** Whether the collapse is open (provided internally) */
  open?: boolean
  /** Press handler provided by Collapse */
  onPress?: () => void
}

function CollapseHeader ({
  style,
  iconStyle,
  containerStyle,
  children,
  variant,
  iconPosition = 'left',
  icon = true,
  open,
  onPress,
  ...props
}: CollapseHeaderProps): ReactNode {
  if (icon === true) icon = faCaretRight
  const reverse = iconPosition === 'right'
  const animation = useRef(new Animated.Value(open ? 1 : 0)).current

  useDidUpdate(() => {
    Animated.timing(
      animation,
      {
        toValue: open ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }, [open])

  return pug`
    Div.root(
      row
      style=style
      styleName=[variant]
      onPress=onPress
      reverse=reverse
      ...props
    )
      if icon
        Animated.View(
          style={
            transform: [{
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [reverse ? '180deg' : '0deg', '90deg']
              })
            }]
          }
        )
          Icon(icon=icon style=iconStyle)
      Div.container(style=containerStyle styleName={reverse})
        if typeof children === 'string'
          Span= children
        else
          = children
  `
}

export default observer(themed('CollapseHeader', CollapseHeader))
