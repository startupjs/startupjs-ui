import { type ReactNode } from 'react'
import { type LabelProps as MultiSliderLabelProps } from '@startupjs-ui/react-native-multi-slider'
import { css, pug, useCssVariable } from 'startupjs'
import Div from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'

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
  const labelWidth = Number(useCssVariable('--Range-label-width', 96)) || 96

  return pug`
    Div.root(part='root')
      if showOne
        = renderLabel(oneMarkerLeftPosition, oneMarkerValue, labelWidth)
      if showTwo
        = renderLabel(twoMarkerLeftPosition, twoMarkerValue, labelWidth)
  `
}

function renderLabel (position: number, value: string | number, labelWidth: number): ReactNode {
  return pug`
    Div.label(part='label' style={ left: position - labelWidth / 2 })
      Span.text(part='text')= value
      Span.arrow(part='arrow')
  `
}

export default Label

css`
  .root {
    position: relative;
  }

  .label {
    position: absolute;
    top: var(--Range-label-top);
    width: var(--Range-label-width);
    align-items: center;
  }

  .text {
    background-color: var(--Range-label-bg);
    padding-top: var(--Range-label-padding-y);
    padding-bottom: var(--Range-label-padding-y);
    padding-left: var(--Range-label-padding-x);
    padding-right: var(--Range-label-padding-x);
    font-style: normal;
    font-size: var(--Range-label-font-size);
    line-height: var(--Range-label-line-height);
    color: var(--Range-label-color);
    box-shadow: var(--Range-label-shadow);
    border-radius: var(--Range-label-radius);
  }

  .arrow {
    width: 0;
    height: 0;
    background-color: transparent;
    border-style: solid;
    border-left-width: var(--Range-label-arrow-size);
    border-right-width: var(--Range-label-arrow-size);
    border-bottom-width: var(--Range-label-arrow-size);
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: var(--Range-label-bg);
    transform: rotate(180deg);
  }
`
