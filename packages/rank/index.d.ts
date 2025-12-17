/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface RankProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Options list (strings, numbers, or `{ value, label }` objects) @default [] */
    options?: any[];
    /** Current order as a list of option values @default [] */
    value?: any[];
    /** Disable drag-and-drop interactions @default false */
    disabled?: boolean;
    /** Render a non-interactive ranked list @default false */
    readonly?: boolean;
    /** Fired when order changes; receives array of option values */
    onChange?: (value: any[]) => void;
}
declare const _default: import("react").ComponentType<RankProps>;
export default _default;
