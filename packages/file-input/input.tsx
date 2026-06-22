import { type ReactNode } from 'react'
import { observer, themed } from 'startupjs'

import type { FileInputProps } from './index'

export default observer(themed('FileInput', FileInput))

function FileInput (props: FileInputProps): ReactNode {
  throw Error(`
    <FileInput /> is only available in Expo projects
  `)
}
