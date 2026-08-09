import { Dropzone as _Dropzone } from './components/Dropzone'
import { DropzoneFullScreen } from './components/DropzoneFullScreen'

Object.assign(_Dropzone, { FullScreen: DropzoneFullScreen })

export const Dropzone = _Dropzone as typeof _Dropzone & { FullScreen: typeof DropzoneFullScreen }

export { DropzoneFullScreen }
export { DropzoneAccept, DropzoneIdle, DropzoneReject } from './components/DropzoneStatus'
export { useDropzone } from './use-dropzone'
export * from './mime-types'
export * from './utils'

export type {
  DropzoneFullScreenEmits,
  DropzoneFullScreenProps,
  DropzoneFullScreenStylesNames,
} from './components/DropzoneFullScreen'
export type {
  DropzoneCssVariables,
  DropzoneEmits,
  DropzoneProps,
  DropzoneStylesNames,
  DropzoneVariant,
} from './components/Dropzone'
export type {
  DropzoneAcceptProps,
  DropzoneIdleProps,
  DropzoneRejectProps,
} from './components/DropzoneStatus'
export type { DropzoneContextValue } from './Dropzone.context'
export type { UseDropzoneOptions } from './use-dropzone'
export type { Accept, DropEvent, FileError, FileRejection, FileWithPath } from './types'
