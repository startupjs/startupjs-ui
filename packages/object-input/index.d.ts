/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<ObjectInputProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ObjectInputProps {
    /** Custom styles for the wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the inner input container */
    inputStyle?: StyleProp<ViewStyle>;
    /** Model binding for object values */
    $value: any;
    /** Error messages keyed by property name @default {} */
    errors?: Record<string, any>;
    /** Input metadata keyed by property name */
    properties: Record<string, any>;
    /** Order of rendered inputs */
    order?: string[];
    /** Render inputs in a row */
    row?: boolean;
    /** Disable interactions */
    disabled?: boolean;
    /** Render as read-only */
    readonly?: boolean;
    /** Custom wrapper renderer (used by Input layout wrappers) */
    _renderWrapper?: (params: {
        style: StyleProp<ViewStyle> | undefined;
        testID?: string;
        props?: Record<string, any>;
    }, children: ReactNode) => ReactNode;
    /** Test identifier */
    testID?: string;
    /** Additional props forwarded to the wrapper */
    [key: string]: any;
}
