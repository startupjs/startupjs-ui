import { useImperativeHandle, type ReactNode } from 'react'
import { pug, observer, themed } from 'startupjs'
import Button from '@startupjs-ui/button'
import Div from '@startupjs-ui/div'

import confirm from '@startupjs-ui/dialogs/confirm'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import deleteFileApi from './deleteFile'
import uploadFileApi from './uploadFile'
import type { FileInputProps, FileInputRef } from './index'

export default observer(themed('FileInput', FileInput))

function FileInput ({
  value: initialFileId,
  mimeTypes,
  image,
  uploadImmediately = true,
  beforeUpload,
  afterUpload,
  onChange = () => undefined,
  render,
  testID,
  ref
}: FileInputProps): ReactNode {
  let fileId = initialFileId

  useImperativeHandle(ref, (): FileInputRef => {
    return {
      pickFile,
      deleteFile: handleDeleteFile,
      uploadFile: uploadFileApi
    }
  })

  async function pickFile () {
    let result: any
    if (image) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })
    } else {
      result = await DocumentPicker.getDocumentAsync({ type: mimeTypes as any })
    }

    const cancelled = result?.cancelled ?? result?.canceled
    const assets = result?.assets
    if (cancelled || !assets) return

    if (!uploadImmediately) return assets[0]

    if (beforeUpload) {
      const beforeUploadResult = beforeUpload()
      if (beforeUploadResult?.then) await beforeUploadResult
    }

    let handled
    for (const asset of assets) {
      if (handled) throw Error('Only one file is allowed')
      fileId = await uploadFileApi(asset, fileId)
      if (!fileId) return
      onChange(fileId)
      handled = true
    }

    if (afterUpload) {
      const afterUploadResult = afterUpload()
      if (afterUploadResult?.then) await afterUploadResult
    }
  }

  async function handleDeleteFile () {
    if (!fileId) return
    if (!await confirm('Are you sure you want to delete this file?')) return
    const deleted = await deleteFileApi(fileId)
    if (!deleted) return
    onChange(undefined)
  }

  function renderDefault (): ReactNode {
    const deleteTestID = testID ? `${testID}-delete` : undefined

    return pug`
      if fileId
        Div(row)
          Button(testID=testID onPress=pickFile) Change
          Button(testID=deleteTestID pushed onPress=handleDeleteFile variant='text' icon=faTrashAlt)
      else
        Button(testID=testID onPress=pickFile) Upload file
    `
  }

  return pug`
    if render
      = render({ testID })
    else
      = renderDefault()
  `
}
