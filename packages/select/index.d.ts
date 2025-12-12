/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type RefObject } from 'react';
import { type UITextInputProps } from '@startupjs-ui/text-input';
import { type SelectOption } from './Wrapper/helpers';
declare const _default: import("react").ComponentType<SelectProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface SelectProps extends Omit<UITextInputProps, 'value' | 'onChangeText' | 'icon' | 'iconPosition' | '_renderWrapper' | 'editable'> {
    /** Available options (strings, numbers, or objects with `{ value, label }`) @default [] */
    options?: SelectOption[];
    /** Current selected value */
    value?: any;
    /** Show empty/none option @default true */
    showEmptyValue?: boolean;
    /** Label for the empty/none option */
    emptyValueLabel?: string | number;
    /** Ref forwarded to underlying TextInput */
    ref?: RefObject<any>;
    /** Test identifier passed to wrapper */
    testID?: string;
    /** Fired when selected value changes */
    onChange?: (value: any) => void;
}
