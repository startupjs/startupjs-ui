import { type ReactNode } from 'react'
import { css, pug, observer, themed } from 'startupjs'

import Icon, { type IconProps } from '@startupjs-ui/icon'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'

export default themed('Rating', observer(Star))

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
      part='root'
      styleName={ active }
      style=style
      icon=faStar
    )
  `
}

css`
  .icon {
    color: var(--Rating-star-color);
  }

  .icon.active {
    color: var(--Rating-star-active-color);
  }
`
