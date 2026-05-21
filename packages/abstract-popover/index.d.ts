/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type AbstractPopoverAttachment as Attachment, type AbstractPopoverPlacement as Placement, type AbstractPopoverPosition as Position } from './constants';
import './index.cssx.styl';
export declare const _PropsJsonSchema: {};
export interface AbstractPopoverProps {
    /** Additional cssx styleName(s) for the popover root */
    styleName?: any;
    /** Custom styles for popover container */
    style?: StyleProp<ViewStyle>;
    /** Ref to the anchor element (must support `measure`) */
    anchorRef: any;
    /** Show/hide popover */
    visible?: boolean;
    /** Primary position @default 'bottom' */
    position?: Position;
    /** Attachment relative to anchor @default 'start' */
    attachment?: Attachment;
    /** Ordered placements fallback list */
    placements?: readonly Placement[];
    /** Show arrow */
    arrow?: boolean;
    /** Match popover width to anchor */
    matchAnchorWidth?: boolean;
    /** Open animation duration (ms) @default 100 */
    durationOpen?: number;
    /** Close animation duration (ms) @default 50 */
    durationClose?: number;
    /** Wrap rendered popover node */
    renderWrapper?: (node: ReactNode) => ReactNode;
    /** Called right before open animation starts */
    onRequestOpen?: () => void;
    /** Called right before close animation starts */
    onRequestClose?: () => void;
    /** Called after open animation ends */
    onOpenComplete?: (finished?: boolean) => void;
    /** Called after close animation ends */
    onCloseComplete?: (finished?: boolean) => void;
    /** Popover content */
    children?: ReactNode;
    /** Stable test id for the popover surface (portal root); maps to `data-testid` on web */
    testID?: string;
}
declare const _default: import("react").ComponentType<AbstractPopoverProps>;
export default _default;
