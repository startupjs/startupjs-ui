import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'

interface ProgressFillerProps {
  style?: StyleProp<ViewStyle>
  value: number
}

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function ProgressFiller ({ style, value }: ProgressFillerProps): ReactNode {
  const duration = toNumber(useCssVariable('--Progress-duration', 300), 300)

  return pug`
    View.filler(style=[{ width: value + '%', transition: 'width ' + (duration / 1000) + 's' }, style])
  `
}

export default observer(themed('Progress', ProgressFiller))

css`
  .filler {
    background-color: var(--Progress-filler-bg);
  }
`
