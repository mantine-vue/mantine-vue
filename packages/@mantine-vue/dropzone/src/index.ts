import { Dropzone as _Dropzone } from './Dropzone'
import { DropzoneFullScreen } from './DropzoneFullScreen'

Object.assign(_Dropzone, { FullScreen: DropzoneFullScreen })

export const Dropzone = _Dropzone as typeof _Dropzone & { FullScreen: typeof DropzoneFullScreen }

export { DropzoneFullScreen }
export { DropzoneAccept, DropzoneIdle, DropzoneReject } from './DropzoneStatus'
export { useDropzone } from './use-dropzone'
export * from './mime-types'
export * from './utils'

export type { DropzoneFullScreenProps, DropzoneFullScreenStylesNames } from './DropzoneFullScreen'
export type {
  DropzoneCssVariables,
  DropzoneProps,
  DropzoneStylesNames,
  DropzoneVariant,
} from './Dropzone'
export type { DropzoneAcceptProps, DropzoneIdleProps, DropzoneRejectProps } from './DropzoneStatus'
export type { DropzoneContextValue } from './Dropzone.context'
export type { UseDropzoneOptions } from './use-dropzone'
export type { Accept, DropEvent, FileError, FileRejection, FileWithPath } from './types'
