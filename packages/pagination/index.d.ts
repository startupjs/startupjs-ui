/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
declare const _default: React.ComponentType<PaginationProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface PaginationProps {
    /** Custom styles applied to the root container */
    style?: StyleProp<ViewStyle>;
    /** Display variant controlling layout @default 'full' */
    variant?: 'full' | 'compact';
    /** Zero-based page index */
    page?: number;
    /** Scoped model for page index */
    $page?: any;
    /** Total number of pages */
    pages?: number;
    /** Number of items to skip before current page @default 0 */
    skip?: number;
    /** Scoped model for skip value */
    $skip?: any;
    /** Number of items per page @default 1 */
    limit?: number;
    /** Scoped model for limit value */
    $limit?: any;
    /** Total number of items @default 0 */
    count?: number;
    /** Visible pages at the start and end @default 1 */
    boundaryCount?: number;
    /** Visible sibling pages around the current page @default 1 */
    siblingCount?: number;
    /** Show button for the first page @default false */
    showFirstButton?: boolean;
    /** Show button for the last page @default false */
    showLastButton?: boolean;
    /** Show previous page button @default true */
    showPrevButton?: boolean;
    /** Show next page button @default true */
    showNextButton?: boolean;
    /** Disable all navigation @default false */
    disabled?: boolean;
    /** Called when the page changes */
    onChangePage?: (page: number) => void;
    /** Called when the page size changes */
    onChangeLimit?: (limit: number) => void;
}
