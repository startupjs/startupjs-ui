/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type ComponentType, type RefObject } from 'react';
import { type StyleProp, type ViewStyle, type ViewProps } from 'react-native';
type SupportedOrientation = 'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right';
export declare const _PropsJsonSchema: {};
export interface ModalProps {
    /** Custom styles applied to the root view */
    style?: StyleProp<ViewStyle>;
    /** Custom styles applied to the modal backdrop */
    overlayStyle?: StyleProp<ViewStyle>;
    /** Custom styles applied to the modal content container */
    modalStyle?: StyleProp<ViewStyle>;
    /** Content rendered inside the modal */
    children?: ReactNode;
    /** Layout variant @default 'window' */
    variant?: 'window' | 'fullscreen';
    /** Controlled visibility flag */
    visible?: boolean;
    /** Model binding for two-way visibility control */
    $visible?: any;
    /** Imperative ref to open/close modal when not controlled */
    ref?: RefObject<any>;
    /** Header title text */
    title?: string;
    /** Accessible role for the modal surface on web @default 'dialog' */
    role?: ViewProps['role'];
    /** Label for cancel action @default 'Cancel' */
    cancelLabel?: string;
    /** Label for confirm action @default 'Confirm' */
    confirmLabel?: string;
    /** Show a cross in the header @default true */
    showCross?: boolean;
    /** Makes the backdrop clickable @default true */
    enableBackdropPress?: boolean;
    /** Component used as modal container @default SafeAreaView */
    ModalElement?: ComponentType<any>;
    /** Modal animation type @default 'fade' */
    animationType?: 'slide' | 'fade' | 'none';
    /** Render modal with transparent background @default true */
    transparent?: boolean;
    /** Control status bar translucency on Android */
    statusBarTranslucent?: boolean;
    /** Allowed screen orientations */
    supportedOrientations?: SupportedOrientation[];
    /** Test identifier for the modal surface */
    testID?: string;
    /** Callback fired after modal becomes visible */
    onShow?: () => void;
    /** Called when user clicks on the cross */
    onCrossPress?: (event: any) => void | Promise<void>;
    /** Show only the one `OK` button that uses this handler */
    onCancel?: (event: any) => void | Promise<void>;
    /** Show two buttons: `OK` uses this handler and `Cancel` uses the `onCancel` handler */
    onConfirm?: (event: any) => void | Promise<void>;
    /** Called when the user clicks on the backdrop (requires enableBackdropPress to be true) */
    onBackdropPress?: (event: any) => void | Promise<void>;
    /** Called when the orientation changes while the modal is displayed */
    onOrientationChange?: (event: any) => void;
    /** Called when user requests to close the modal (hardware back, menu button, Esc, etc.). Also fired after cross/backdrop/cancel/confirm unless handlers call event.preventDefault() */
    onRequestClose?: (value?: boolean) => void;
    /** Called once the modal has been dismissed */
    onDismiss?: () => void;
    /** DEPRECATED: use onRequestClose instead */
    onChange?: (value?: boolean) => void;
}
declare const ObservedModal: any;
export default ObservedModal;
