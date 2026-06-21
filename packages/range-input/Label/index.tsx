import { type ReactNode } from 'react'
import { type LabelProps as MultiSliderLabelProps } from '@startupjs-ui/react-native-multi-slider'
import { pug, cssx } from 'startupjs'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'
import STYLES from './index.cssx.styl'

const LABEL_STYLE: any = cssx('label', STYLES).style

function Label ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  oneMarkerPressed,
  twoMarkerPressed
}: MultiSliderLabelProps): ReactNode {
  // Number.isFinite - This condition has been taken from original vendor component.
  // Be aware when you change this.
  const showOne = oneMarkerPressed && Number.isFinite(oneMarkerLeftPosition) &&
    Number.isFinite(oneMarkerValue)
  const showTwo = twoMarkerPressed && Number.isFinite(twoMarkerLeftPosition) &&
    Number.isFinite(twoMarkerValue)

  return pug`
    Div.root
      if showOne
        = renderLabel(oneMarkerLeftPosition, oneMarkerValue)
      if showTwo
        = renderLabel(twoMarkerLeftPosition, twoMarkerValue)
  `
}

function renderLabel (position: number, value: string | number): ReactNode {
  return pug`
    Div.label(style={ left: position - LABEL_STYLE.width / 2 })
      // todo: implement common tooltip style
      Span.text= value
      Span.arrow
  `
}

export default Label
