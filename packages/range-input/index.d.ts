/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type MultiSliderProps } from '@ptomasroos/react-native-multi-slider';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<RangeInputProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface RangeInputProps {
    /** Custom marker label component @default Label */
    customLabel?: MultiSliderProps['customLabel'];
    /** Show pressed marker label @default true */
    showLabel?: boolean;
    /** Minimum value @default 0 */
    min?: number;
    /** Maximum value @default 100 */
    max?: number;
    /** Enable two markers mode @default false */
    range?: boolean;
    /** Show steps on the track @default false */
    showSteps?: boolean;
    /** Show step labels when showSteps is enabled @default true */
    showStepLabels?: boolean;
    /** Show step markers when showSteps is enabled @default true */
    showStepMarkers?: boolean;
    /** Step size @default 1 */
    step?: number;
    /** Current value (number for single marker, array for two markers) */
    value?: number | number[] | null;
    /** Slider width in pixels @default 280 */
    width?: number;
    /** Style overrides for the container part */
    containerStyle?: any;
    /** Style overrides for the selected track part */
    selectedStyle?: any;
    /** Style overrides for the step label part */
    stepLabelStyle?: any;
    /** Style overrides for the step marker part */
    stepMarkerStyle?: any;
    /** Style overrides for the step part */
    stepStyle?: any;
    /** Style overrides for the track part */
    trackStyle?: any;
    /** Style overrides for the marker part */
    markerStyle?: any;
    /** Change handler */
    onChange?: (value: number | number[]) => void | Promise<void>;
    /** Handler triggered when sliding starts */
    onChangeStart?: MultiSliderProps['onValuesChangeStart'];
    /** Handler triggered when sliding ends */
    onChangeFinish?: MultiSliderProps['onValuesChangeFinish'];
}
