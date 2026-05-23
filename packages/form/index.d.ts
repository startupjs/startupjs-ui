/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface FormProps {
    /** Schema describing form fields (json-schema compatible) */
    fields?: Record<string, any>;
    /** Reactive schema (overrides `fields`) */
    $fields?: any;
    /** Reactive errors model (managed by validation) */
    $errors?: any;
    /** Styles for the wrapper */
    style?: StyleProp<ViewStyle>;
    /** Styles for the inner input container */
    inputStyle?: StyleProp<ViewStyle>;
    /** Order of rendered fields */
    order?: string[];
    /** Render inputs in a row */
    row?: boolean;
    /** Explicit errors object (overrides `$errors`) */
    errors?: Record<string, any>;
    /** Custom inputs by type key */
    customInputs?: Record<string, any>;
    /** Custom wrapper renderer for inputs */
    _renderWrapper?: (params: {
        style: StyleProp<ViewStyle> | undefined;
    }, children: ReactNode) => ReactNode;
    /** Enable validation or pass validate hook from useValidate */
    validate?: boolean | any;
    /** Disable interactions */
    disabled?: boolean;
    /** Render as read-only */
    readonly?: boolean;
    /** Test identifier */
    testID?: string;
    /** Model binding for form values */
    $value: any;
    /** Do not use; pass `fields` instead (will throw if set) */
    properties?: Record<string, any>;
    /** Additional props passed to custom inputs via `useFormProps` */
    [key: string]: any;
}
declare const _default: import("react").ComponentType<FormProps>;
export default _default;
export { default as useFormProps } from './useFormProps';
export { default as useValidate } from './useValidate';
export { default as useFormFields } from './useFormFields';
export { default as useFormFields$ } from './useFormFields$';
