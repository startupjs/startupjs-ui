/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ComponentType, type JSXElementConstructor, type ReactNode } from 'react';
import { type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
declare const _default: ComponentType<ButtonProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ButtonProps {
    /** color name @default 'secondary' */
    color?: string;
    /** variant @default 'outlined' */
    variant?: 'flat' | 'outlined' | 'text';
    /** size @default 'm' */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
    /** icon component */
    icon?: ComponentType | JSXElementConstructor<any>;
    /** shape @default 'rounded' */
    shape?: 'squared' | 'rounded' | 'circle';
    /** icon position relative to label @default 'left' */
    iconPosition?: 'left' | 'right';
    /** disable button */
    disabled?: boolean;
    /** button label text or a custom react node */
    children?: ReactNode;
    /** custom styles for root element */
    style?: StyleProp<ViewStyle>;
    /** custom styles for icon */
    iconStyle?: StyleProp<TextStyle>;
    /** custom styles for label text */
    textStyle?: StyleProp<TextStyle>;
    /** custom styles for hover state */
    hoverStyle?: StyleProp<ViewStyle>;
    /** custom styles for active state */
    activeStyle?: StyleProp<ViewStyle>;
    /** onPress handler */
    onPress?: (event: GestureResponderEvent) => void | Promise<void>;
}
