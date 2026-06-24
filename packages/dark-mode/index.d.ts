/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type GestureResponderEvent } from 'react-native';
import { type ButtonProps } from '@startupjs-ui/button';
declare const _default: import("react").ComponentType<DarkModeProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface DarkModeProps extends Omit<ButtonProps, 'icon' | 'children' | 'onPress'> {
    /** custom button content */
    children?: ReactNode;
    /** icon shown while the current theme is light */
    lightIcon?: ButtonProps['icon'];
    /** icon shown while the current theme is dark */
    darkIcon?: ButtonProps['icon'];
    /** onPress handler called after the theme preference is toggled */
    onPress?: (event: GestureResponderEvent) => void | Promise<void>;
}
