/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type DivProps } from '@startupjs-ui/div';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<CardProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface CardProps extends Omit<DivProps, 'variant' | 'level' | 'children' | 'style'> {
    /** Custom styles applied to the root view */
    style?: DivProps['style'];
    /** Content rendered inside Card */
    children?: ReactNode;
    /** Shadow intensity level @default 1 */
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    /** Visual appearance variant @default 'elevated' */
    variant?: 'elevated' | 'outlined';
}
