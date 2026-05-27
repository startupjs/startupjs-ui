/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type StyleProp, type ViewStyle } from 'react-native';
import { type RadioOption, type RadioValue } from './helpers';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<RadioProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface RadioProps {
    /** Custom styles for the root wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for each option item */
    inputStyle?: StyleProp<ViewStyle>;
    /** Current selected value */
    value?: RadioValue;
    /** List of options @default [] */
    options?: RadioOption[];
    /** Render options in a row @default false */
    row?: boolean;
    /** Disable interactions @default false */
    disabled?: boolean;
    /** Render as non-interactive @default false */
    readonly?: boolean;
    /** Change handler */
    onChange?: (value: any) => void;
    /** Error flag @private */
    _hasError?: boolean;
    /** Additional props forwarded to the radio group */
    [key: string]: any;
}
