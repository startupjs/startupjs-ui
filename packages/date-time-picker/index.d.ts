/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type UITextInputProps } from '@startupjs-ui/text-input';
import './index.cssx.styl';
declare const _default: import("react").ComponentType<DateTimePickerProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface DateTimePickerProps extends Omit<UITextInputProps, 'value' | 'onChangeText' | 'ref'> {
    /** Ref to access underlying input */
    ref?: RefObject<any>;
    /** Custom styles applied to the root input */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for content container */
    contentStyle?: Record<string, any>;
    /** Date formatting string from moment */
    dateFormat?: string;
    /** Picker display mode @default 'spinner' */
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    /** Minutes step for time selection @default 5 */
    timeInterval?: number;
    /** Force 24 hour time format (auto-detected when not provided) */
    is24Hour?: boolean;
    /** Input size preset @default 'm' */
    size?: 'l' | 'm' | 's';
    /** Picker type @default 'datetime' */
    mode?: 'date' | 'time' | 'datetime' | 'countdown';
    /** Custom renderer for input component */
    renderInput?: (inputProps: Record<string, any> & {
        onChangeVisible: (value: boolean) => void;
    }) => ReactNode;
    /** Locale identifier (falls back to device locale) */
    locale?: string;
    /** Selected date range (start/end timestamps) */
    range?: [number, number];
    /** IANA timezone name @default moment.tz.guess() */
    timezone?: string;
    /** Array of disabled day timestamps */
    disabledDays?: number[];
    /** Current value as timestamp */
    date?: number;
    /** Disable interactions @default false */
    disabled?: boolean;
    /** Render as readonly @default false */
    readonly?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Maximum available date as timestamp */
    maxDate?: number;
    /** Minimum available date as timestamp */
    minDate?: number;
    /** Controlled visibility */
    visible?: boolean;
    /** Scoped model controlling visibility */
    $visible?: any;
    /** Test identifier for the input */
    testID?: string;
    /** Test identifier for calendar root */
    calendarTestID?: string;
    /** Called when user presses input (native) */
    onPressIn?: (...args: any[]) => void;
    /** Called with selected timestamp (or undefined when cleared) */
    onChangeDate?: (value?: number) => void;
    /** Called before opening (controlled visibility mode) */
    onRequestOpen?: () => void;
    /** Called before closing (controlled visibility mode) */
    onRequestClose?: () => void;
    /** Error state flag @private */
    _hasError?: boolean;
}
