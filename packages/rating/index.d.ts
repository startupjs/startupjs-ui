/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type StyleProp, type ViewStyle } from 'react-native';
declare const _default: import("react").ComponentType<RatingProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface RatingProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to each star wrapper */
    starStyle?: StyleProp<ViewStyle>;
    /** Custom styles applied to the readonly value label */
    valueStyle?: StyleProp<any>;
    /** Rating value displayed with stars @default 0 */
    value?: number;
    /** Disable interactions and show compact view */
    readonly?: boolean;
    /** Handler called when user selects a value */
    onChange?: (value: number) => void;
    /** Test identifier */
    testID?: string;
}
