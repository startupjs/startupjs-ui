/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<ProgressProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ProgressProps {
    /** Custom styles applied to the wrapper */
    style?: StyleProp<ViewStyle>;
    /** Percent value between 0 and 100 @default 0 */
    value?: number;
    /** Label content rendered under the progress bar */
    children?: ReactNode;
    /** Progress visual variant @default 'linear' */
    variant?: 'linear' | 'circular';
    /** Shape of the progress track @default 'rounded' */
    shape?: DivProps['shape'];
    /** Height of the progress bar @default u(0.5) */
    width?: number;
    /** Style overrides for the progress track part */
    progressStyle?: DivProps['style'];
    /** Style overrides for the filler part */
    fillerStyle?: StyleProp<ViewStyle>;
}
