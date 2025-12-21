/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
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
    _renderWrapper?: (style: any, children: ReactNode) => ReactNode;
    [key: string]: any;
}
