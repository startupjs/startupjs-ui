/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type RefObject } from 'react';
import type { InputWrapperConfiguration } from './wrapInput';
export declare const _PropsJsonSchema: {};
export interface InputProps {
    /** Explicit input type override (ignores schema guessing) */
    input?: 'array' | 'checkbox' | 'color' | 'date' | 'datetime' | 'time' | 'multiselect' | 'number' | 'object' | 'password' | 'file' | 'rank' | 'radio' | 'range' | 'select' | 'text';
    /** Schema or input type @default 'text' */
    type?: 'array' | 'checkbox' | 'color' | 'date' | 'datetime' | 'time' | 'multiselect' | 'number' | 'object' | 'password' | 'file' | 'rank' | 'radio' | 'range' | 'select' | 'text' | 'string' | 'boolean' | 'integer';
    /** Input value */
    value?: any;
    /** Two-way binding for value */
    $value?: any;
    /** Label text */
    label?: string;
    /** Description text */
    description?: string;
    /** Layout for label and description @default 'rows' when label/description is present */
    layout?: 'pure' | 'rows' | 'columns';
    /** Configuration overrides for the wrapper */
    configuration?: InputWrapperConfiguration;
    /** Error message or list of messages */
    error?: string | string[];
    /** Required flag or json-schema required object */
    required?: boolean | object;
    /** Disable interactions */
    disabled?: boolean;
    /** Render as read-only */
    readonly?: boolean;
    /** Test id for generated testID */
    testId?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Options for select-like inputs */
    options?: any;
    /** Schema enum for select-like inputs */
    enum?: any[];
    /** Schema items for array inputs */
    items?: any;
    /** Schema properties for object inputs */
    properties?: Record<string, any>;
    /** Value change handler (checkbox/select/range/etc.) */
    onChange?: (...args: any[]) => void;
    /** Text change handler */
    onChangeText?: (...args: any[]) => void;
    /** Number change handler */
    onChangeNumber?: (...args: any[]) => void;
    /** Date/time change handler */
    onChangeDate?: (...args: any[]) => void;
    /** Color change handler */
    onChangeColor?: (...args: any[]) => void;
    /** Focus handler */
    onFocus?: (...args: any[]) => void;
    /** Blur handler */
    onBlur?: (...args: any[]) => void;
    /** Imperative ref to the rendered input */
    ref?: RefObject<any>;
    /** Additional props passed to the underlying input */
    [key: string]: any;
}
declare const _default: import("react").ComponentType<InputProps>;
export default _default;
export { default as wrapInput, isWrapped, IS_WRAPPED } from './wrapInput';
export { default as guessInput } from './helpers/guessInput';
export { setCustomInputs, customInputs } from './globalCustomInputs';
export { useInputMeta } from './inputs';
export { default as useCustomInputs, CustomInputsContext } from './useCustomInputs';
