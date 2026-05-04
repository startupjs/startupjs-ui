/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
export declare const _PropsJsonSchema: {};
export interface CheckboxProps {
    /** Custom styles for the wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the input element */
    inputStyle?: StyleProp<ViewStyle>;
    /** Visual variant @default 'checkbox' */
    variant?: 'checkbox' | 'switch';
    /** Checked state @default false */
    value?: boolean;
    /** Custom icon for the checkbox variant */
    icon?: any;
    /** Custom background color when checked */
    checkedBgColor?: string;
    /** Disable interactions @default false */
    disabled?: boolean;
    /** Render a non-interactive value @default false */
    readonly?: boolean;
    /** Change handler */
    onChange?: (value: boolean) => void;
    /** Focus handler (ignored on wrapper) */
    onFocus?: (...args: any[]) => void;
    /** Blur handler (ignored on wrapper) */
    onBlur?: (...args: any[]) => void;
    /** Style override for the switch thumb */
    switchCircleStyle?: StyleProp<ViewStyle>;
    /** Error flag @private */
    _hasError?: boolean;
    [key: string]: any;
}
declare const _default: import("react").ComponentType<CheckboxProps>;
export default _default;
