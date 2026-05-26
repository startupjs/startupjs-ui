/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type Ref } from 'react';
import { type StyleProp } from 'react-native';
import { type UIRole } from '@startupjs-ui/core';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<ScrollViewProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ScrollViewProps {
    /** Ref to access the underlying ScrollView instance */
    ref?: Ref<any>;
    /** Accessibility role. Includes RN roles plus web-only ARIA roles used by RNW. */
    role?: UIRole;
    /** Custom styles applied to the root ScrollView */
    style?: StyleProp<any>;
    /** Content rendered inside ScrollView */
    children?: ReactNode;
    /** Expand content container to take full available height */
    full?: boolean;
    /** Additional props forwarded to the underlying ScrollView */
    [key: string]: any;
}
