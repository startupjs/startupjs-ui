/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
import { type IconProps } from '@startupjs-ui/icon';
import './index.cssx.styl';
export declare const _PropsJsonSchema: {};
export interface ItemProps extends Omit<DivProps, 'style' | 'onPress'> {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside Item */
    children?: ReactNode;
    /** Navigation target passed to Link wrapper */
    to?: string;
    /** Image URL displayed on the left side */
    url?: string;
    /** Icon displayed on the left side when no image is provided */
    icon?: IconProps['icon'];
    /** onPress handler */
    onPress?: (event: any) => void;
}
export interface ItemLeftProps {
    /** Custom styles applied to the left part */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside left part */
    children?: ReactNode;
}
export interface ItemContentProps {
    /** Custom styles applied to the content wrapper */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside the content area */
    children?: ReactNode;
}
export interface ItemRightProps {
    /** Custom styles applied to the right part */
    style?: StyleProp<ViewStyle>;
    /** Content rendered inside right part */
    children?: ReactNode;
}
declare const ObservedItem: any;
export default ObservedItem;
