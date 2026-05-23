import { useMemo, type ReactNode } from 'react'
import MultiSlider, { type MultiSliderProps } from '@startupjs-ui/react-native-multi-slider'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Div from '@startupjs-ui/div'
import Label from './Label'
import './index.cssx.styl'

export default observer(themed('RangeInput', RangeInput))

export const _PropsJsonSchema = {/* RangeInputProps */}

export interface RangeInputProps {
  /** Custom marker label component @default Label */
  customLabel?: MultiSliderProps['customLabel']
  /** Show pressed marker label @default true */
  showLabel?: boolean
  /** Minimum value @default 0 */
  min?: number
  /** Maximum value @default 100 */
  max?: number
  /** Enable two markers mode @default false */
  range?: boolean
  /** Show steps on the track @default false */
  showSteps?: boolean
  /** Show step labels when showSteps is enabled @default true */
  showStepLabels?: boolean
  /** Show step markers when showSteps is enabled @default true */
  showStepMarkers?: boolean
  /** Step size @default 1 */
  step?: number
  /** Current value (number for single marker, array for two markers) */
  value?: number | number[] | null
  /** Slider width in pixels @default 280 */
  width?: number
  /** Style overrides for the container part */
  containerStyle?: any
  /** Style overrides for the selected track part */
  selectedStyle?: any
  /** Style overrides for the step label part */
  stepLabelStyle?: any
  /** Style overrides for the step marker part */
  stepMarkerStyle?: any
  /** Style overrides for the step part */
  stepStyle?: any
  /** Style overrides for the track part */
  trackStyle?: any
  /** Style overrides for the marker part */
  markerStyle?: any
  /** Change handler */
  onChange?: (value: number | number[]) => void | Promise<void>
  /** Handler triggered when sliding starts */
  onChangeStart?: MultiSliderProps['onValuesChangeStart']
  /** Handler triggered when sliding ends */
  onChangeFinish?: MultiSliderProps['onValuesChangeFinish']
  /** Test identifier */
  testID?: string
  /** Web id for label association */
  id?: string
  /** Accessible name */
  'aria-label'?: string
  /** Element ids that label this slider */
  'aria-labelledby'?: string
  /** Element ids that describe this slider */
  'aria-describedby'?: string
  /** Whether the slider value is invalid */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** Element id for the related error message */
  'aria-errormessage'?: string
  /** Whether a value is required */
  'aria-required'?: boolean
  /** Whether the slider is disabled */
  disabled?: boolean
  [key: string]: any
}

function RangeInput ({
  customLabel = Label,
  showLabel = true,
  min = 0,
  max = 100,
  range = false,
  showSteps = false,
  showStepLabels = true,
  showStepMarkers = true,
  step = 1,
  value,
  width = 280,
  onChange,
  onChangeFinish,
  onChangeStart,
  testID,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-errormessage': ariaErrorMessage,
  'aria-required': ariaRequired,
  disabled,
  ...props
}: RangeInputProps): ReactNode {
  useMemo(() => {
    if (typeof value === 'undefined' || value === null) {
      // to initialize a model with default value if it is missing
      throw new Promise<void>(resolve => {
        (async () => {
          // TODO: maybe throw an Error instead of console.warn?
          if (!onChange) console.warn('[@startupjs-ui/range-input] `onChange` is required when `value` is undefined')
          await onChange?.(range ? [min, max] : min)
          resolve()
        })()
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // vendor component requires an array in any case
  const values = Array.isArray(value) ? value : [value as any]
  const ariaValueText = values.filter(value => value != null).join(' - ') || undefined

  function onValuesChange (nextValues: number[]) {
    onChange && onChange(range ? nextValues : nextValues[0])
  }

  return pug`
    Div.root(
      id=id
      testID=testID
      role='slider'
      aria-label=ariaLabel
      aria-labelledby=ariaLabelledBy
      aria-describedby=ariaDescribedBy
      aria-invalid=ariaInvalid
      aria-errormessage=ariaErrorMessage
      aria-required=ariaRequired
      aria-disabled=disabled
      aria-valuemin=min
      aria-valuemax=max
      aria-valuenow=!range && values[0] != null ? values[0] : undefined
      aria-valuetext=ariaValueText
    )
      MultiSlider(
        ...props
        customLabel=customLabel
        enableLabel=showLabel
        enabledOne=!disabled
        enabledTwo=range && !disabled
        min=min
        max=max
        showSteps=showSteps
        showStepLabels=showStepLabels
        showStepMarkers=showStepMarkers
        sliderLength=width
        snapped
        step=step
        values=values
        onValuesChange=onValuesChange
        onValuesChangeFinish=onChangeFinish
        onValuesChangeStart=onChangeStart
      )
  `
}
