import type { CollectionSpec, Signal, SignalModelConstructor } from 'startupjs'

export interface FileDoc {
  storageType: string
  mimeType: string
  filename?: string
  encoding?: string
  extension?: string
  createdAt: number
  updatedAt: number
}

export interface FileAccessContext {
  source: 'api' | 'model'
  session?: any
  fileId: string
  file?: FileDoc
  req?: any
}

export interface FileUploadContext {
  source: 'api'
  session?: any
  fileId?: string
  file?: FileDoc
  req: any
  blob: unknown
  meta: Partial<FileDoc>
}

export interface FileDeleteContext {
  source: 'api'
  session?: any
  fileId: string
  file: FileDoc
  req: any
}

export interface FileUploadTransformResult {
  fileId?: string
  blob?: unknown
  meta?: Partial<FileDoc>
}

export interface FilesPluginServerOptions {
  canRead?: (context: FileAccessContext) => boolean | Promise<boolean>
  canUpload?: (context: FileUploadContext) => boolean | Promise<boolean>
  canDelete?: (context: FileDeleteContext) => boolean | Promise<boolean>
  transformUpload?: (context: FileUploadContext) => FileUploadTransformResult | void | Promise<FileUploadTransformResult | void>
}

interface FilesModel extends Signal<FileDoc[]> {
  addNew (file: Omit<FileDoc, 'createdAt' | 'updatedAt'>): Promise<string>
  getUrl (fileId: string, extension?: string): string
  getDownloadUrl (fileId: string, extension?: string): string
  getUploadUrl (fileId?: string): string
  getDeleteUrl (fileId: string): string
}

interface FileModel extends Signal<FileDoc> {
  getUrl (): string
  getDownloadUrl (): string
  getUploadUrl (): string
  getDeleteUrl (): string
  getBlob (): Promise<Blob>
}

type FilesModelConstructor = SignalModelConstructor<FileDoc[], FilesModel>
type FileModelConstructor = SignalModelConstructor<FileDoc, FileModel>

declare module 'teamplay' {
  interface TeamplayPluginCollections {
    '@startupjs-ui/file-input/files': {
      files: CollectionSpec<FileDoc, FilesModelConstructor, FileModelConstructor>
    }
  }
}

export {}
