/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import './index.cssx.styl';
interface AutoSuggestOptionObject {
    value?: any;
    label?: string | number;
}
type AutoSuggestOption = string | number | AutoSuggestOptionObject;
type AutoSuggestValue = AutoSuggestOption | null | undefined;
export declare const _PropsJsonSchema: {};
export interface AutoSuggestProps {
    /** Custom styles for the suggestion list container */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the TextInput wrapper */
    captionStyle?: StyleProp<ViewStyle>;
    /** Custom styles for the TextInput input field */
    inputStyle?: StyleProp<TextStyle>;
    /** Custom styles for the clear icon */
    iconStyle?: StyleProp<TextStyle>;
    /** Custom icon for the input */
    inputIcon?: any;
    /** Options list (strings, numbers, or objects with value/label) @default [] */
    options?: AutoSuggestOption[];
    /** Current selected value */
    value?: AutoSuggestValue;
    /** Placeholder text @default 'Select value' */
    placeholder?: string | number;
    /** Custom item renderer (item, index, highlightedIndex) */
    renderItem?: (item: AutoSuggestOption, index: number, selectIndexValue: number) => ReactNode;
    /** Show loader in the list @default false */
    isLoading?: boolean;
    /** Disable input interactions */
    disabled?: boolean;
    /** Render as non-interactive */
    readonly?: boolean;
    /** Change handler for selected value */
    onChange?: (value?: any) => void | Promise<void>;
    /** Called after the list is closed */
    onDismiss?: () => void;
    /** Change handler for input text */
    onChangeText?: (text: string) => void;
    /** Called when list scroll reaches the end */
    onScrollEnd?: () => void;
    /** Test identifier */
    testID?: string;
}
declare const _default: import("react").ComponentType<AutoSuggestProps>;
export default _default;
