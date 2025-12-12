import { useMemo, type ReactNode } from 'react'
import MultiSlider, { type MultiSliderProps } from '@ptomasroos/react-native-multi-slider'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
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
  ...props
}: RangeInputProps): ReactNode {
  useMemo(() => {
    if (typeof value === 'undefined' || value === null) {
      // to initialize a model with default value if it is missing
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw new Promise<void>(resolve => {
        void (async () => {
          if (!onChange) throw new Error('[@startupjs-ui/range-input] `onChange` is required when `value` is undefined')
          await onChange(range ? [min, max] : min)
          resolve()
        })()
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // vendor component requires an array in any case
  const values = Array.isArray(value) ? value : [value as any]

  function onValuesChange (nextValues: number[]) {
    onChange && onChange(range ? nextValues : nextValues[0])
  }

  return pug`
    MultiSlider.root(
      ...props
      part='root'
      customLabel=customLabel
      enableLabel=showLabel
      enabledTwo=range
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
