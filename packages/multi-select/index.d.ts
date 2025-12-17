/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<MultiSelectProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface MultiSelectOption {
    label: any;
    value: any;
}
export interface MultiSelectProps {
    /** Custom styles for the Popover anchor wrapper */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the input wrapper */
    inputStyle?: StyleProp<ViewStyle>;
    /** Available options (objects with `{ label, value }` or primitives) @default [] */
    options?: Array<MultiSelectOption | string | number | boolean>;
    /** Selected values @default [] */
    value?: any[];
    /** Placeholder text shown when empty @default 'Select' */
    placeholder?: string;
    /** Disable interactions @default false */
    disabled?: boolean;
    /** Render non-editable value @default false */
    readonly?: boolean;
    /** Maximum number of visible tags (extra tags are collapsed) */
    tagLimit?: number;
    /** Behavior when tags are limited (legacy prop) @default 'hidden' */
    tagLimitVariant?: 'hidden' | 'disabled';
    /** Maximum number of selectable tags */
    maxTagCount?: number;
    /** Custom tag renderer */
    TagComponent?: any;
    /** Custom input renderer */
    InputComponent?: any;
    /** Match Popover width to anchor on web @default false */
    hasWidthCaption?: boolean;
    /** Custom suggestion item renderer */
    renderListItem?: (options: {
        item: MultiSelectOption;
        index: number;
        selected: boolean;
    }) => ReactNode;
    /** Called when selected values change */
    onChange?: (value: any[]) => void;
    /** Called when a value is selected */
    onSelect?: (value: any) => void;
    /** Called when a value is removed */
    onRemove?: (value: any) => void;
    /** Called when dropdown opens */
    onFocus?: () => void;
    /** Called when dropdown closes */
    onBlur?: () => void;
    /** Ref providing imperative `focus()` / `blur()` methods */
    ref?: RefObject<any>;
    /** Error flag @private */
    _hasError?: boolean;
}
