/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<TagProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface TagProps extends Omit<DivProps, 'variant'> {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the label text */
    textStyle?: StyleProp<TextStyle>;
    /** Tag content */
    children?: ReactNode;
    /** Tag color name @default 'primary' */
    color?: string;
    /** Tag appearance variant @default 'flat' */
    variant?: 'flat' | 'outlined' | 'outlined-bg';
    /** Tag size preset @default 'm' */
    size?: 's' | 'm';
    /** Icon displayed on the left side */
    icon?: object | (() => any);
    /** Custom styles applied to the left icon */
    iconStyle?: StyleProp<TextStyle>;
    /** Icon displayed on the right side */
    secondaryIcon?: object | (() => any);
    /** Custom styles applied to the right icon */
    secondaryIconStyle?: StyleProp<TextStyle>;
    /** Disable interactions and apply disabled styles */
    disabled?: boolean;
    /** Custom style for hover state */
    hoverStyle?: StyleProp<ViewStyle>;
    /** Custom style for active state */
    activeStyle?: StyleProp<ViewStyle>;
    /** Shape of the tag corners @default 'circle' */
    shape?: 'circle' | 'rounded';
    /** Handler for tag press */
    onPress?: (event: GestureResponderEvent) => void;
    /** Handler for left icon press */
    onIconPress?: (event: GestureResponderEvent) => void;
    /** Handler for right icon press */
    onSecondaryIconPress?: (event: GestureResponderEvent) => void;
}
