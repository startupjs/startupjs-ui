/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { type AvatarProps } from '@startupjs-ui/avatar';
import { type DivProps } from '@startupjs-ui/div';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<UserProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface UserProps extends DivProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the name text */
    nameStyle?: StyleProp<TextStyle>;
    /** Custom styles applied to the description text */
    descriptionStyle?: StyleProp<TextStyle>;
    /** Avatar image source URL */
    avatarUrl?: string;
    /** Additional description text below the name */
    description?: string;
    /** Maximum number of lines for the description */
    descriptionNumberOfLines?: number;
    /** User name displayed next to the avatar */
    name?: string;
    /** Position of the avatar relative to text @default 'left' */
    avatarPosition?: 'left' | 'right';
    /** Size preset forwarded to avatar and texts @default 'm' */
    size?: 's' | 'm' | 'l';
    /** Status indicator name for the avatar */
    status?: 'online' | 'away' | string;
    /** Custom components for avatar statuses */
    statusComponents?: AvatarProps['statusComponents'];
}
