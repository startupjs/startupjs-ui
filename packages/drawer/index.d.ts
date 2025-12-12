/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ComponentType, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
export declare const _PropsJsonSchema: {};
export interface DrawerProps {
    /** Custom styles applied to the drawer container */
    style?: StyleProp<ViewStyle>;
    /** Root component wrapping the drawer area @default SafeAreaView */
    AreaComponent?: ComponentType<any>;
    /** Component used as the drawer content wrapper @default View */
    ContentComponent?: ComponentType<any>;
    /** Custom styles applied to the swipe responder zone */
    swipeStyle?: StyleProp<ViewStyle>;
    /** Content rendered inside the drawer */
    children?: ReactNode;
    /** Controlled visibility flag @default false */
    visible?: boolean;
    /** Drawer position relative to the screen @default 'left' */
    position?: 'left' | 'right' | 'top' | 'bottom';
    /** Enable swipe-to-close interaction @default true */
    isSwipe?: boolean;
    /** Render a dimming overlay behind the drawer @default true */
    hasOverlay?: boolean;
    /** Show swipe responder zone @default true */
    showResponder?: boolean;
    /** Called after drawer is dismissed (after hide animation completes) */
    onDismiss: () => void;
    /** Called after drawer becomes visible (after show animation completes) */
    onRequestOpen?: () => void;
}
declare const _default: ComponentType<DrawerProps>;
export default _default;
