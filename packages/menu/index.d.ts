/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
export declare const _PropsJsonSchema: {};
export interface MenuProps extends Omit<DivProps, 'variant' | 'style'> {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside Menu */
    children?: ReactNode;
    /** Active border position passed to Menu items */
    activeBorder?: 'top' | 'bottom' | 'left' | 'right' | 'none';
    /** Color applied to active Menu items */
    activeColor?: string;
    /** Icon position applied to nested Menu items @default 'left' */
    iconPosition?: 'left' | 'right';
    /** Layout orientation @default 'vertical' */
    variant?: 'vertical' | 'horizontal';
}
declare const ObservedMenu: any;
export { default as MenuItem } from './MenuItem';
export default ObservedMenu;
