/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type RefObject } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<ColorPickerProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ColorPickerProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Current hex color value @default '#fff' */
    value?: string;
    /** Disables opening and auto-closes picker @default false */
    disabled?: boolean;
    /** Size of the button @default 'm' */
    size?: 's' | 'm' | 'l';
    /** Called with the selected hex color */
    onChangeColor?: (color: string) => void;
    /** Test identifier */
    testID?: string;
    /** Imperative ref to open/close picker */
    ref?: RefObject<any>;
    /** Additional props forwarded to the color button */
    [key: string]: any;
}
