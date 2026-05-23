/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface DropdownProps {
    /** Ref to control dropdown programmatically */
    ref?: RefObject<DropdownRef>;
    /** Custom styles applied to the dropdown content container */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the caption wrapper */
    captionStyle?: StyleProp<ViewStyle>;
    /** Custom styles applied to the active item view */
    activeItemStyle?: StyleProp<ViewStyle>;
    /** Dropdown caption and items */
    children?: ReactNode;
    /** Currently selected value @default '' */
    value?: string | number;
    /** Popover position @default 'bottom' */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Popover attachment @default 'start' */
    attachment?: 'start' | 'center' | 'end';
    /** Fallback placements order */
    placements?: any;
    /** Drawer items rendering variant @default 'buttons' */
    drawerVariant?: 'list' | 'buttons' | 'pure';
    /** Title shown in list drawer variant */
    drawerListTitle?: string;
    /** Cancel button label in buttons drawer variant @default 'Cancel' */
    drawerCancelLabel?: string;
    /** Disable caption press */
    disabled?: boolean;
    /** Accessible name for the dropdown trigger */
    'aria-label'?: string;
    /** Element id that labels the dropdown trigger */
    'aria-labelledby'?: string;
    /** Element id that describes the dropdown trigger */
    'aria-describedby'?: string;
    /** Enable drawer behavior on small screens @default true */
    hasDrawer?: boolean;
    /** Show swipe responder zone in drawer */
    showDrawerResponder?: boolean;
    /** Called when item is selected */
    onChange?: (value: string | number | undefined) => void;
    /** Called when dropdown is dismissed via overlay/cancel */
    onDismiss?: () => void;
    /** Test identifier for the dropdown trigger */
    testID?: string;
    /** Test id for the desktop/tablet popover surface (passed to `AbstractPopover`) */
    popoverTestID?: string;
}
export interface DropdownRef {
    /** Open dropdown programmatically */
    open: () => void;
    /** Close dropdown programmatically */
    close: () => void;
}
declare const ObservedDropdown: any;
export default ObservedDropdown;
