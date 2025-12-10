/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import React, { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface SmartSidebarProps {
    /** Custom styles applied to the root wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the sidebar container when using fixed layout */
    sidebarStyle?: StyleProp<ViewStyle>;
    /** Model controlling sidebar open state */
    $open?: any;
    /** Open sidebar by default on desktop @default false */
    defaultOpen?: boolean;
    /** Destroy sidebar content when closed @default false */
    lazy?: boolean;
    /** Disable sidebar interactions @default false */
    disabled?: boolean;
    /** Breakpoint width after which sidebar switches to fixed layout @default 1024 */
    fixedLayoutBreakpoint?: number;
    /** Sidebar position relative to the screen @default 'left' */
    position?: 'left' | 'right';
    /** Sidebar width in density-independent pixels @default 264 */
    width?: number;
    /** Content rendered inside the main area */
    children?: ReactNode;
    /** Renderer for sidebar content */
    renderContent?: () => ReactNode;
}
declare const _default: React.ComponentType<SmartSidebarProps>;
export default _default;
