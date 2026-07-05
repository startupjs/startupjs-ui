export const FILES_PLUGIN_NAME = 'files'
// collections allowed to hold file metadata docs (uploadBuffer's `collection`
// option). Overridable through the plugin's isomorphic options:
//   plugins: { files: { isomorphic: { collections: ['files', 'chatImages'] } } }
export const DEFAULT_FILE_COLLECTIONS = ['files']

export const GET_FILE_URL = '/api/__ui__/files/get/:fileId'
export const getFileUrl = (id, extension) => {
  if (!id) throw Error('[ui/FileInput] getFileUrl: fileId is required')
  return GET_FILE_URL.replace(':fileId', id) + (extension ? `.${extension}` : '')
}

export const UPLOAD_SINGLE_FILE_URL = '/api/__ui__/files/upload/single/:fileId?'
export const getUploadFileUrl = id => {
  return UPLOAD_SINGLE_FILE_URL.replace('/:fileId?', id ? `/${id}` : '')
}

export const DELETE_FILE_URL = '/api/__ui__/files/delete/:fileId'
export const getDeleteFileUrl = id => {
  if (!id) throw Error('[ui/FileInput] getDeleteFileUrl: fileId is required')
  return DELETE_FILE_URL.replace(':fileId', id)
}
