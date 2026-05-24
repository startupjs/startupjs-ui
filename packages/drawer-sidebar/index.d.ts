/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import React, { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface DrawerSidebarProps {
    /** Custom styles applied to the root DrawerLayout */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside the main area */
    children?: ReactNode;
    /** Model controlling drawer open state */
    $open?: any;
    /** Drawer position relative to the screen @default 'left' */
    position?: 'left' | 'right';
    /** Render drawer content only when open @default false */
    lazy?: boolean;
    /** Disable drawer interactions @default false */
    disabled?: boolean;
    /** Drawer width in density-independent pixels @default 264 */
    width?: number;
    /** Renderer for drawer content */
    renderContent?: () => ReactNode;
}
declare const _default: React.ComponentType<DrawerSidebarProps>;
export default _default;
