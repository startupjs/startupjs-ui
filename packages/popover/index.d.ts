/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type AbstractPopoverProps } from '@startupjs-ui/abstract-popover';
import './index.cssx.styl';
export declare const _PropsJsonSchema: {};
export interface PopoverProps extends Omit<AbstractPopoverProps, 'anchorRef' | 'children' | 'style' | 'visible'> {
    /** Ref to control popover programmatically */
    ref?: RefObject<PopoverRef>;
    /** Custom styles for the anchor wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the popover container */
    attachmentStyle?: StyleProp<ViewStyle>;
    /** Custom styles for the dismiss overlay */
    overlayStyle?: StyleProp<ViewStyle>;
    /** Controlled visibility flag */
    visible?: boolean;
    /** Two-way binding value controlling visibility */
    $visible?: any;
    /** Called when visibility should change */
    onChange?: (visible: boolean) => void;
    /** Anchor content */
    children?: ReactNode;
    /** Render function for popover content */
    renderContent?: () => ReactNode;
}
export interface PopoverRef {
    /** Open the popover */
    open: () => void;
    /** Close the popover */
    close: () => void;
}
declare const _default: import("react").ComponentType<PopoverProps>;
export default _default;
