/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<LinkProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface LinkProps extends Omit<DivProps, 'style'> {
    /** Custom styles applied to the root view */
    style?: StyleProp<TextStyle | ViewStyle>;
    /** Content rendered inside Link */
    children?: ReactNode;
    /** Link target path or URL */
    to?: string;
    /** Alias for `to` */
    href?: string;
    /** Use router push instead of navigate */
    push?: boolean;
    /** Replace current history entry instead of pushing */
    replace?: boolean;
    /** Display mode @default auto-detected */
    display?: 'inline' | 'block';
    /** Color variant for inline links @default 'default' */
    color?: 'default' | 'primary';
    /** Theme name used for styling */
    theme?: string;
    /** Render text in bold style when inline @default false */
    bold?: boolean;
    /** Render text in italic style when inline @default false */
    italic?: boolean;
    /** onPress handler */
    onPress?: (event: any) => void;
}
