/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type UIRole } from '@startupjs-ui/core';
type FormWrapperProps = {
    style: StyleProp<ViewStyle> | undefined;
    testID?: string;
    id?: string;
    role?: UIRole;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-disabled'?: boolean;
    'aria-readonly'?: boolean;
};
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
    _renderWrapper?: (params: FormWrapperProps, children: ReactNode) => ReactNode;
    /** Enable validation or pass validate hook from useValidate */
    validate?: boolean | any;
    /** Disable interactions */
    disabled?: boolean;
    /** Render as read-only */
    readonly?: boolean;
    /** Test identifier */
    testID?: string;
    /** Web id for the wrapper */
    id?: string;
    /** ARIA role for the wrapper */
    role?: UIRole;
    /** Accessible name for the wrapper */
    'aria-label'?: string;
    /** Id of the element that labels the wrapper */
    'aria-labelledby'?: string;
    /** Id of the element that describes the wrapper */
    'aria-describedby'?: string;
    /** Id of the element that describes the wrapper error */
    'aria-errormessage'?: string;
    /** Invalid state for the wrapper */
    'aria-invalid'?: boolean;
    /** Required state for the wrapper */
    'aria-required'?: boolean;
    /** Disabled state for the wrapper */
    'aria-disabled'?: boolean;
    /** Readonly state for the wrapper */
    'aria-readonly'?: boolean;
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
