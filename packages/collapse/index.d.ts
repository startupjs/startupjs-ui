/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
import { type CollapseHeaderProps } from './CollapseHeader';
import './index.cssx.styl';
export declare const _PropsJsonSchema: {};
export interface CollapseProps extends Omit<DivProps, 'style' | 'children' | 'variant' | 'align'> {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside Collapse or via Collapse.Content */
    children?: ReactNode;
    /** Header title when no custom Collapse.Header is provided */
    title?: ReactNode;
    /** Controlled open state @default false */
    open?: boolean;
    /** Scoped model for open state */
    $open?: any;
    /** Visual appearance variant @default 'full' */
    variant?: 'full' | 'pure';
    /** Icon displayed in header; true uses default caret @default true */
    icon?: CollapseHeaderProps['icon'];
    /** Called when open state changes */
    onChange?: (open: boolean) => void;
    /** Custom styles applied to the collapsible container */
    collapsibleContainerStyle?: StyleProp<ViewStyle>;
    /** Alignment of collapsed content */
    align?: 'top' | 'center' | 'bottom';
    /** Height when collapsed */
    collapsedHeight?: number;
    /** Enable pointer events while collapsed */
    enablePointerEvents?: boolean;
    /** Animation duration in ms */
    duration?: number;
    /** Easing function or preset name */
    easing?: ((value: number) => number) | string;
    /** Render children even when collapsed */
    renderChildrenCollapsed?: boolean;
    /** Callback fired after collapse animation ends */
    onAnimationEnd?: () => void;
}
declare const ObservedCollapse: any;
export { default as CollapseHeader, _PropsJsonSchema as CollapseHeaderPropsJsonSchema } from './CollapseHeader';
export { default as CollapseContent, _PropsJsonSchema as CollapseContentPropsJsonSchema } from './CollapseContent';
export default ObservedCollapse;
