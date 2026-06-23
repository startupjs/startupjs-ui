import { type ReactNode } from 'react'
import { css, pug, observer, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'

const DEFAULT_WIDTH = 'tablet'
const LEGACY_UNIT = 8

export default observer(themed('Content', Content))

export const _PropsJsonSchema = {/* ContentProps */}

export interface ContentProps extends Omit<DivProps, 'style' | 'padding' | 'full'> {
  /** Custom styles applied to the root view */
  style?: DivProps['style']
  /** Content rendered inside wrapper */
  children?: ReactNode
  /** Add equal top and bottom padding. true maps to default spacing @default false */
  padding?: boolean | number
  /** Expand to take full available space in parent flex layout @default false */
  full?: boolean
  /** Content width preset @default 'tablet' */
  width?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full'
  /** Remove horizontal paddings */
  pure?: boolean
}

function Content ({
  children,
  padding = false,
  pure,
  width = DEFAULT_WIDTH,
  full = false,
  ...props
}: ContentProps): ReactNode {
  const _rootStyle: Record<string, any> = {}
  if (padding === true) padding = 2
  if (typeof padding === 'number') {
    _rootStyle.paddingTop = padding * LEGACY_UNIT
    _rootStyle.paddingBottom = padding * LEGACY_UNIT
  }

  return pug`
    Div.root(
      part='root'
      style=_rootStyle
      styleName=['width-' + width, { pure }]
      full=full
      ...props
    )= children
  `
}

css`
  .root {
    padding-left: var(--Content-gutter);
    padding-right: var(--Content-gutter);
    align-self: center;
    width: 100%;
  }

  .root.pure {
    padding-left: 0;
    padding-right: 0;
  }

  .root.width-mobile {
    max-width: var(--Content-width-mobile);
  }

  .root.width-tablet {
    max-width: var(--Content-width-tablet);
  }

  .root.width-desktop {
    max-width: var(--Content-width-desktop);
  }

  .root.width-wide {
    max-width: var(--Content-width-wide);
  }
`
