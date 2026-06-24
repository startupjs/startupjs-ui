/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type RefObject } from 'react';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { type UITextInputProps } from '@startupjs-ui/text-input';
export declare const _PropsJsonSchema: {};
export interface NumberInputProps {
    /** Custom styles for the wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for increment and decrement buttons */
    buttonStyle?: StyleProp<ViewStyle>;
    /** Current numeric value */
    value?: number;
    /** Input size preset @default 'm' */
    size?: 'l' | 'm' | 's';
    /** Buttons layout @default 'vertical' */
    buttonsMode?: 'none' | 'horizontal' | 'vertical';
    /** Disable interactions @default false */
    disabled?: boolean;
    /** Render a non-editable value @default false */
    readonly?: boolean;
    /** Maximum allowed value */
    max?: number;
    /** Minimum allowed value */
    min?: number;
    /** Increment step @default 1 */
    step?: number;
    /** Units label displayed next to the value */
    units?: string;
    /** Units position @default 'left' */
    unitsPosition?: 'left' | 'right';
    /** Return key type for the keyboard @default 'done' */
    returnKeyType?: UITextInputProps['returnKeyType'];
    /** Handler triggered when numeric value changes */
    onChangeNumber?: (value?: number) => void;
    /** Ref to access the underlying TextInput */
    ref?: RefObject<any>;
    /** Custom styles for the input element */
    inputStyle?: StyleProp<TextStyle>;
    /** Placeholder text */
    placeholder?: string | number;
    /** Error flag @private */
    _hasError?: boolean;
    [key: string]: any;
}
declare const _default: import("react").ComponentType<NumberInputProps>;
export default _default;
