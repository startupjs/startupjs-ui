import { type ReactNode } from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export const _PropsJsonSchema = {/* BrProps */}

export interface BrProps {
  /** Custom styles applied to the spacer */
  style?: StyleProp<TextStyle>
  /** Use half-height spacing */
  half?: boolean
  /** Number of spacer lines @default 1 */
  lines?: number
  /** Test identifier */
  testID?: string
}

function Br ({
  style,
  half = false,
  lines = 1,
  testID
}: BrProps): ReactNode {
  const lineHeight = toNumber(useCssVariable('--Br-line-height', 16), 16)
  const height = half ? lineHeight / 2 : lineHeight * lines
  return pug`
    Text.root(part='root' style=[{ height }, style] testID=testID)
  `
}

export default themed('Br', observer(Br))

css`
  .root {
    flex-shrink: 0;
  }
`
