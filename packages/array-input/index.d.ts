/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type UIRole } from '@startupjs-ui/core';
type ArrayInputWrapperProps = {
    style?: any;
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
declare const _default: import("react").ComponentType<ArrayInputProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ArrayInputProps {
    /** Custom styles for the wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the inner input container */
    inputStyle?: StyleProp<ViewStyle>;
    /** Model binding for array values */
    $value: any;
    /** Input metadata for array items (must include `input` or `type`) */
    items: Record<string, any>;
    /** Custom wrapper renderer (used by Input layout wrappers) */
    _renderWrapper?: (params: ArrayInputWrapperProps, children: ReactNode) => ReactNode;
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
    [key: string]: any;
}
