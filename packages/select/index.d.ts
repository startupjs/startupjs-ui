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
    /** Test identifier passed to wrapper; on web the native `<select>` overlay also receives `data-testid="{testID}-combobox"` when set */
    testID?: string;
    /** Cross-platform accessible name */
    'aria-label'?: string;
    /** Accessible label forwarded to the web select overlay */
    accessibilityLabel?: string;
    /** Accessible hint forwarded to the web select overlay */
    accessibilityHint?: string;
    /** Web-only control id forwarded to the native select overlay */
    id?: string;
    /** Native id alias forwarded to the native select overlay */
    nativeID?: string;
    /** Web-only labelled-by relationship */
    'aria-labelledby'?: string;
    /** Web-only described-by relationship */
    'aria-describedby'?: string;
    /** Web-only error message relationship */
    'aria-errormessage'?: string;
    /** Web-only invalid state */
    'aria-invalid'?: boolean;
    /** Fired when selected value changes */
    onChange?: (value: any) => void;
}
