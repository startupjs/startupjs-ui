import { type ReactNode } from 'react'
import { pug, observer, themed } from 'startupjs'

import Icon, { type IconProps } from '@startupjs-ui/icon'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import './index.cssx.styl'

export default observer(themed('Rating', Star))

export interface StarProps {
  /** Custom styles applied to the star icon */
  style?: IconProps['style']
  /** Highlight the star as active */
  active?: boolean
}

function Star ({
  style,
  active
}: StarProps): ReactNode {
  return pug`
    Icon.icon(
      styleName={ active }
      style=style
      icon=faStar
    )
  `
}
