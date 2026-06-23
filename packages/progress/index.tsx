import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'

import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import Filler from './filler'
import CircleFiller from './circleFiller'

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export default themed('Progress', observer(Progress))

export const _PropsJsonSchema = {/* ProgressProps */}

export interface ProgressProps {
  /** Custom styles applied to the wrapper */
  style?: StyleProp<ViewStyle>
  /** Percent value between 0 and 100 @default 0 */
  value?: number
  /** Label content rendered under the progress bar */
  children?: ReactNode
  /** Progress visual variant @default 'linear' */
  variant?: 'linear' | 'circular'
  /** Shape of the progress track @default 'rounded' */
  shape?: DivProps['shape']
  /** Height of the progress bar @default 4 */
  width?: number
  /** Style overrides for the progress track part */
  progressStyle?: DivProps['style']
  /** Style overrides for the filler part */
  fillerStyle?: StyleProp<ViewStyle>
  /** Test identifier */
  testID?: string
}

function Progress ({
  style,
  value = 0,
  children,
  variant = 'linear',
  shape = 'rounded',
  width,
  progressStyle,
  fillerStyle,
  testID
}: ProgressProps): ReactNode {
  const defaultWidth = toNumber(useCssVariable('--Progress-width', 4), 4)
  const resolvedWidth = width ?? defaultWidth
  const isCircular = variant === 'circular'
  const extraStyle = isCircular ? {} : { height: resolvedWidth }

  return pug`
    View(part='root' style=style testID=testID)
      Div.progress(
        part='progress'
        style=[extraStyle, progressStyle]
        styleName=[variant]
        shape=shape
      )
        //- To normalize value pass value=Math.min(value, 100)
        if isCircular
          CircleFiller(part='filler' style=[extraStyle, fillerStyle] value=value width=resolvedWidth)
        else
          Filler(part='filler' style=[extraStyle, fillerStyle] value=value)
      if typeof children === 'string'
        Span.label= children
      else
        = children
  `
}

css`
  .progress {
    overflow: hidden;
  }

  .progress.linear {
    background-color: var(--Progress-track-bg);
  }

  .label {
    margin-top: var(--Progress-label-margin-top);
    font-size: var(--Progress-label-font-size);
    line-height: var(--Progress-label-line-height);
  }
`
