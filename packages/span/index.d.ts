/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type TextStyle, type StyleProp, type TextProps } from 'react-native';
import { type UIRole } from '@startupjs-ui/core';
declare const _default: import("react").ComponentType<SpanProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface SpanProps extends Omit<TextProps, 'role'> {
    /** Ref to access underlying <Text> */
    ref?: RefObject<any>;
    /** Accessibility role. Includes RN roles plus web-only ARIA roles used by RNW. */
    role?: UIRole;
    /** Web-only target input id when role='label'. */
    htmlFor?: string;
    /** Custom styles applied to the root view */
    style?: StyleProp<TextStyle>;
    /** Content rendered inside Span */
    children?: ReactNode;
    /** bold text */
    bold?: boolean;
    /** italic text */
    italic?: boolean;
    /** full width (flex: 1) */
    full?: boolean;
    /** description text color */
    description?: boolean;
    /** Omit the default root typography (font size/family/weight and base color)
     * while still applying inherited text styles and animation handling. Useful
     * when the surrounding stylesheet fully controls typography. @default false */
    pure?: boolean;
    /** h1 header */
    h1?: boolean;
    /** h2 header */
    h2?: boolean;
    /** h3 header */
    h3?: boolean;
    /** h4 header */
    h4?: boolean;
    /** h5 header */
    h5?: boolean;
    /** h6 header */
    h6?: boolean;
    /** @deprecated use h1-h6 props instead */
    variant?: 'default' | 'description' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
