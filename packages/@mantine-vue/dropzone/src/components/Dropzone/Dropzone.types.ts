import type { Accept, DropEvent, FileError, FileRejection, FileWithPath } from '../../types'
import type { MantineColor, MantineRadius } from '@mantine-vue/core'

export type DropzoneStylesNames = 'root' | 'inner'
export type DropzoneVariant = 'filled' | 'light'
export type DropzoneCssVariables = {
  root:
    | '--dropzone-radius'
    | '--dropzone-accept-color'
    | '--dropzone-accept-bg'
    | '--dropzone-reject-color'
    | '--dropzone-reject-bg'
}

export interface DropzoneProps {
  /** Key of `theme.colors` or any valid CSS color to set colors of `Dropzone.Accept`. @default theme.primaryColor */
  acceptColor?: MantineColor
  /** Key of `theme.colors` or any valid CSS color to set colors of `Dropzone.Reject`. @default 'red' */
  rejectColor?: MantineColor
  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. @default theme.defaultRadius */
  radius?: MantineRadius
  /** Determines whether files capturing is disabled. @default false */
  disabled?: boolean
  /** Determines whether a loading overlay is displayed. @default false */
  loading?: boolean
  /** Accepted MIME types. By default, all file types are accepted. */
  accept?: Accept | string[]
  /** Ref assigned the function that opens the file picker. */
  openRef?: any
  /** Determines whether multiple files can be selected. @default true */
  multiple?: boolean
  /** Maximum file size in bytes. @default Infinity */
  maxSize?: number
  /** Name of the internal form control. */
  name?: string
  /** Maximum number of files that can be selected at once. */
  maxFiles?: number
  /** Determines whether the root element receives focus on mount. @default false */
  autoFocus?: boolean
  /** Determines whether clicking opens the file picker. @default true */
  activateOnClick?: boolean
  /** Determines whether drag and drop is enabled. @default true */
  activateOnDrag?: boolean
  /** Determines whether Space/Enter opens the file picker. @default true */
  activateOnKeyboard?: boolean
  /** Determines whether drag events bubble. @default true */
  dragEventsBubbling?: boolean
  /** Prevents files dropped on the document from opening in the browser. @default true */
  preventDropOnDocument?: boolean
  /** Uses the File System Access API when supported. @default false */
  useFsAccessApi?: boolean
  /** Use this to provide a custom file aggregator */
  getFilesFromEvent?: (event: DropEvent) => Promise<FileWithPath[]>
  /** Custom validation function. It must return null if there's no errors. */
  validator?: (file: FileWithPath) => FileError | FileError[] | null
  /** Enables pointer events on the inner element. @default false */
  enablePointerEvents?: boolean
  /** Props passed down to the Loader component */
  loaderProps?: Record<string, any>
  /** Props passed down to the internal Input component */
  inputProps?: Record<string, any>
  /** Visual variant. @default 'light' */
  variant?: DropzoneVariant
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  [key: string]: any
}

/** Events emitted by `Dropzone`. */
export interface DropzoneEmits {
  /** Emitted when accepted and rejected files are dropped. */
  'drop-any': [files: FileWithPath[], fileRejections: FileRejection[]]
  /** Emitted when valid files are dropped. */
  drop: [files: FileWithPath[]]
  /** Emitted when dropped files do not meet restrictions. */
  reject: [fileRejections: FileRejection[]]
  /** Emitted when the `dragenter` event occurs. */
  'drag-enter': [event: DragEvent]
  /** Emitted when the `dragleave` event occurs. */
  'drag-leave': [event: DragEvent]
  /** Emitted when the `dragover` event occurs. */
  'drag-over': [event: DragEvent]
  /** Emitted when user closes the file selection dialog with no selection. */
  'file-dialog-cancel': []
  /** Emitted when user opens the file selection dialog. */
  'file-dialog-open': []
}
