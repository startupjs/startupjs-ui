/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import React, { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
type BreadcrumbsSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
declare const _default: React.ComponentType<BreadcrumbsProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface BreadcrumbRoute {
    /** Path to navigate to */
    to?: string;
    /** Text label of the route */
    name?: string;
    /** Icon displayed next to the label */
    icon?: object | (() => any);
}
export interface BreadcrumbsProps {
    /** Custom styles applied to the root container */
    style?: StyleProp<ViewStyle>;
    /** List of breadcrumb routes to render */
    routes?: BreadcrumbRoute[];
    /** Separator displayed between routes @default '/' */
    separator?: string | ReactNode;
    /** Size preset controlling text and icon dimensions @default 'm' */
    size?: BreadcrumbsSize;
    /** Replace the current history entry instead of pushing */
    replace?: boolean;
    /** Icon position relative to the label @default 'left' */
    iconPosition?: 'left' | 'right';
}
