/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ComponentType } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type DivProps } from '@startupjs-ui/div';
declare const _default: ComponentType<AvatarProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface AvatarProps extends DivProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Avatar image source URL */
    src?: string;
    /** Size preset or explicit pixel value @default 'm' */
    size?: 's' | 'm' | 'l' | number;
    /** Status indicator name */
    status?: 'online' | 'away' | string;
    /** Avatar shape variant @default 'circle' */
    shape?: DivProps['shape'];
    /** Text used to build fallback initials @default '?' */
    children?: string;
    /** Custom components for status indicators keyed by status */
    statusComponents?: Record<string, ComponentType<any>>;
}
