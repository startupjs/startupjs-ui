/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<BadgeProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface BadgeProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the badge view */
    badgeStyle?: StyleProp<ViewStyle>;
    /** Content rendered inside Badge */
    children?: ReactNode;
    /** Background color name @default 'primary' */
    color?: string;
    /** Label content rendered inside badge */
    label?: string | number;
    /** Icon displayed inside badge */
    icon?: object;
    /** Badge vertical position @default 'top' */
    position?: 'top' | 'bottom';
    /** Badge size preset @default 'm' */
    size?: 's' | 'm' | 'l';
    /** Badge appearance variant @default 'default' */
    variant?: 'default' | 'dot';
    /** Maximum number to display before adding "+" */
    max?: number;
}
