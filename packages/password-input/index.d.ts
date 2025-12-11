/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type RefObject } from 'react';
import { type UITextInputProps } from '@startupjs-ui/text-input';
export declare const _PropsJsonSchema: {};
export interface PasswordInputProps extends UITextInputProps {
    /** Ref to access the underlying TextInput */
    ref?: RefObject<any>;
    /** Custom styles for the wrapper element */
    style?: UITextInputProps['style'];
    /** Custom styles for the input element */
    inputStyle?: UITextInputProps['inputStyle'];
    /** Placeholder text */
    placeholder?: UITextInputProps['placeholder'];
    /** Input value @default '' */
    value?: string;
    /** Size preset @default 'm' */
    size?: 'l' | 'm' | 's';
    /** Disable input interactions @default false */
    disabled?: boolean;
    /** Focus event handler */
    onFocus?: UITextInputProps['onFocus'];
    /** Blur event handler */
    onBlur?: UITextInputProps['onBlur'];
    /** Change text handler */
    onChangeText?: UITextInputProps['onChangeText'];
    /** Error flag @private */
    _hasError?: boolean;
}
declare const _default: import("react").ComponentType<PasswordInputProps>;
export default _default;
