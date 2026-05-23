/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
export { default } from './input';
export declare const _PropsJsonSchema: {};
export interface FileInputProps {
    /** Ref object to access imperative methods (`pickFile`, `deleteFile`, `uploadFile`) */
    ref?: RefObject<FileInputRef>;
    /** Current fileId (stored in `files` model on the server) */
    value?: string;
    /** MIME types accepted by the picker (passed to `expo-document-picker`) */
    mimeTypes?: string | string[];
    /** When true, opens image picker instead of document picker */
    image?: boolean;
    /** Upload selected file immediately after picking @default true */
    uploadImmediately?: boolean;
    /** Hook called before upload starts (can be async) */
    beforeUpload?: () => any;
    /** Hook called after upload finishes (can be async) */
    afterUpload?: () => any;
    /** Called with new fileId after successful upload */
    onChange?: (fileId?: string) => void;
    /** Custom renderer instead of the default Upload/Change/Delete buttons */
    render?: () => ReactNode;
    /** Custom styles (reserved for future use) */
    style?: any;
    /** Test identifier */
    testID?: string;
}
export interface FileInputRef {
    /** Opens the native picker and (optionally) uploads the selected file */
    pickFile: () => Promise<any>;
    /** Deletes the currently selected file */
    deleteFile: () => Promise<void>;
    /** Uploads a picked asset to server and returns new fileId */
    uploadFile: (asset: any, fileId?: string) => Promise<string | undefined>;
}
