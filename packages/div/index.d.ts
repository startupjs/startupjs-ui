/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type StyleProp, type ViewStyle, type ViewProps, type AccessibilityRole } from 'react-native';
declare const _default: import("react").ComponentType<DivProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface DivProps extends ViewProps {
    /** Ref to access underlying <View> or <Pressable> */
    ref?: RefObject<any>;
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside Div */
    children?: ReactNode;
    /** Visual feedback variant @default 'opacity' */
    variant?: 'opacity' | 'highlight';
    /** Render children in a horizontal row */
    row?: boolean;
    /** Allow wrapping when row is enabled */
    wrap?: boolean;
    /** Reverse children order for row layouts */
    reverse?: boolean;
    /** Horizontal alignment when using row/column */
    align?: 'left' | 'center' | 'right';
    /** Vertical alignment when using row/column */
    vAlign?: 'top' | 'center' | 'bottom';
    /** Spacing between children (true maps to default gap) */
    gap?: boolean | number;
    /** Enable press feedback styles (hover and active states) @default true */
    feedback?: boolean;
    /** Custom style for hover state */
    hoverStyle?: StyleProp<ViewStyle>;
    /** Custom style for active state */
    activeStyle?: StyleProp<ViewStyle>;
    /** Disable interactions and apply disabled styles */
    disabled?: boolean;
    /** Elevation level controlling shadow intensity */
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    /** Shape of the container corners */
    shape?: 'squared' | 'rounded' | 'circle';
    /** Add more space from the previous sibling */
    pushed?: boolean | 's' | 'm' | 'l';
    /** Stretch container into negative spacing area */
    bleed?: boolean;
    /** Expand to take full available height (or width if 'row' is true) */
    full?: boolean;
    /** Simple tooltip text */
    tooltip?: string;
    /** Style overrides for tooltip element */
    tooltipStyle?: StyleProp<ViewStyle>;
    /** onPress handler */
    onPress?: (e: any) => void;
    /** onLongPress handler */
    onLongPress?: (e: any) => void;
    /** onPressIn handler */
    onPressIn?: (e: any) => void;
    /** onPressOut handler */
    onPressOut?: (e: any) => void;
    /** Whether view is accessible and focusable (if you can press it it's focusable by default) */
    accessible?: boolean;
    /** Accessibility role passed to native view (if you can press it it's a 'button') */
    accessibilityRole?: AccessibilityRole;
    /** Deprecated custom tooltip renderer @deprecated */
    renderTooltip?: any;
    /** Test ID for testing purposes */
    'data-testid'?: string;
}
