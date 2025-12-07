/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type DivProps } from '@startupjs-ui/div';
import { type IconProps } from '@startupjs-ui/icon';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<AlertProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface AlertProps extends Omit<DivProps, 'variant' | 'style'> {
    /** Custom styles applied to the root view */
    style?: DivProps['style'];
    /** Alert visual style variant @default 'info' */
    variant?: 'info' | 'error' | 'warning' | 'success';
    /** Icon definition or toggle. Pass false to hide icon @default true */
    icon?: boolean | IconProps['icon'];
    /** Title displayed above message */
    title?: string;
    /** Deprecated alias for children @deprecated */
    label?: string;
    /** Content rendered inside Alert */
    children?: ReactNode;
    /** Custom actions renderer displayed at the end */
    renderActions?: () => ReactNode;
    /** Close handler to render default close action */
    onClose?: () => void;
}
