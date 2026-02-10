import { $, sub } from 'startupjs'
import { deleteFile, getDefaultStorageType, saveFileBlob } from '../providers/index.js'

export default async function uploadBuffer (buff, options = {}) {
  let { fileId, meta = {} } = options

  let storageType = meta.storageType
  try {
    storageType ??= await getDefaultStorageType()
  } catch (err) {
    console.error(err)
    throw new Error('Error getting default storage type')
  }

  const create = !fileId
  if (!fileId) fileId = $.id()

  // try to save file to sqlite first to do an early exit if it fails
  try {
    await saveFileBlob(storageType, fileId, buff, meta)
  } catch (err) {
    console.error(err)
    throw new Error('Error saving file')
  }

  if (create) {
    const doc = { id: fileId, ...meta, storageType }
    // if some of the meta fields were undefined, remove them from the doc
    for (const key in meta) {
      if (meta[key] == null) delete doc[key]
    }
    await $.files.addNew(doc)
  } else {
    const $file = await sub($.files[fileId])

    // when changing storageType we should delete the file from the old storageType
    const oldStorageType = $file.storageType.get()
    if (oldStorageType !== storageType) {
      try {
        await deleteFile(oldStorageType, fileId)
      } catch (err) {
        console.error(err)
        throw new Error(`Error deleting file from old storageType ${oldStorageType}`)
      }
    }

    const doc = { ...$file.get(), ...meta, storageType, updatedAt: Date.now() }
    // if some of the meta fields were undefined, remove them from the doc
    for (const key in meta) {
      if (meta[key] == null) delete doc[key]
    }
    await $file.set(doc)
  }
  return fileId
}
