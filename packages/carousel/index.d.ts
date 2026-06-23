/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import React, { type Ref } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface CarouselProps {
    /** Custom styles applied to the outer wrapper */
    style?: StyleProp<ViewStyle>;
    /** Styles for the back arrow container and icon */
    arrowBackStyle?: StyleProp<any>;
    /** Styles for the next arrow container and icon */
    arrowNextStyle?: StyleProp<any>;
    /** Initial active slide index @default 0 */
    startIndex?: number;
    /** Direction of movement @default 'horizontal' */
    variant?: 'horizontal' | 'vertical';
    /** Enable swipe gestures @default true */
    isSwipe?: boolean;
    /** Auto-scroll slides in a loop @default false */
    isLoop?: boolean;
    /** Enable endless carousel mode @default false */
    isEndless?: boolean;
    /** Adjust slide sizes based on available space @default false */
    isResponsive?: boolean;
    /** Show navigation arrows @default true */
    hasArrows?: boolean;
    /** Show navigation dots (responsive only) @default false */
    hasDots?: boolean;
    /** Animation duration in ms @default 300 */
    duration?: number;
    /** Slides to render inside the carousel */
    children?: any[];
    /** Callback fired when active slide changes */
    onChange?: (index: number) => void;
    /** Test identifier */
    testID?: string;
    /** Ref exposing active child and navigation helpers */
    ref?: Ref<any>;
}
declare const _default: React.ComponentType<CarouselProps>;
export default _default;
