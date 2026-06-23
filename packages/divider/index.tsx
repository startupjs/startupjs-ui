import { type ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { css, pug, observer, useCssVariable, themed } from 'startupjs'

const HEIGHT_FALLBACKS = {
  m: 1,
  l: 2
}

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export default themed('Divider', observer(Divider))

export const _PropsJsonSchema = {/* DividerProps */}

export interface DividerProps {
  /** Custom styles applied to the divider */
  style?: StyleProp<ViewStyle>
  /** Divider orientation @default 'horizontal' */
  variant?: 'horizontal' | 'vertical'
  /** Divider thickness preset @default 'm' */
  size?: 'm' | 'l'
  /** Divider length in lines (1 line is 16px) @default 1 */
  lines?: number
  /** Test identifier */
  testID?: string
}

function Divider ({
  style,
  size = 'm',
  lines = 1,
  variant = 'horizontal',
  testID
}: DividerProps): ReactNode {
  const lineWidth = toNumber(useCssVariable(`--Divider-height-${size}`), HEIGHT_FALLBACKS[size])
  const lineHeight = toNumber(useCssVariable('--Divider-line-height', 16), 16)
  const width = lineHeight * lines
  const margin = (width - lineWidth) / 2
  const marginFirstSide = Math.floor(margin)
  const marginSecondSide = Math.ceil(margin)
  const extraStyle: Record<string, any> = {}

  switch (variant) {
    case 'horizontal':
      extraStyle.height = lineWidth
      extraStyle.marginTop = marginFirstSide
      extraStyle.marginBottom = marginSecondSide
      break
    case 'vertical':
      extraStyle.width = lineWidth
      extraStyle.marginLeft = marginFirstSide
      extraStyle.marginRight = marginSecondSide
      break
  }

  return pug`
    View.root(part='root' style=[extraStyle, style] styleName=[size, variant] testID=testID)
  `
}

css`
  .root {
    background-color: var(--Divider-bg);
  }

  .root.horizontal {
    width: 100%;
  }

  .root.vertical {
    height: 100%;
  }
`
