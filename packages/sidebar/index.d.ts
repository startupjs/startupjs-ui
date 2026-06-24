/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
declare const _default: import("react").ComponentType<SidebarProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface SidebarProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the sidebar container */
    sidebarStyle?: StyleProp<ViewStyle>;
    /** Custom styles applied to the main content container */
    contentStyle?: StyleProp<ViewStyle>;
    /** Content rendered inside the main area */
    children?: ReactNode;
    /** Model controlling sidebar open state */
    $open?: any;
    /** Sidebar position relative to the content @default 'left' */
    position?: 'left' | 'right';
    /** Disable sidebar toggling @default false */
    disabled?: boolean;
    /** Sidebar width in density-independent pixels @default 264 */
    width?: number;
    /** Render sidebar content only when open @default false */
    lazy?: boolean;
    /** Custom renderer for sidebar content */
    renderContent?: () => ReactNode;
    /** Test identifier */
    testID?: string;
}
