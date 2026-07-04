import { defineComponent, h, type PropType } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getRadius,
  LoadingOverlay,
  useProps,
  useStyles,
  withBoxProps,
} from '@mantine-vue/core'
import { provideDropzoneContext } from './Dropzone.context'
import { DropzoneAccept, DropzoneIdle, DropzoneReject } from './DropzoneStatus'
import { useDropzone } from './use-dropzone'
import type { Accept, DropEvent, FileError, FileRejection, FileWithPath } from './types'
import classes from './Dropzone.module.css'

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
  /** Key of `theme.colors` or any valid CSS color to set colors of `Dropzone.Accept` @default theme.primaryColor */
  acceptColor?: string
  /** Key of `theme.colors` or any valid CSS color to set colors of `Dropzone.Reject` @default 'red' */
  rejectColor?: string
  /** Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem @default theme.defaultRadius */
  radius?: string | number
  /** Determines whether files capturing should be disabled @default false */
  disabled?: boolean
  /** Called when any files are dropped to the dropzone */
  onDropAny?: (files: FileWithPath[], fileRejections: FileRejection[]) => void
  /** Called when valid files are dropped to the dropzone */
  onDrop: (files: FileWithPath[]) => void
  /** Called when dropped files do not meet file restrictions */
  onReject?: (fileRejections: FileRejection[]) => void
  /** Determines whether a loading overlay should be displayed over the dropzone @default false */
  loading?: boolean
  /** Mime types of the files that dropzone can accept. By default, dropzone accepts all file types. */
  accept?: Accept | string[]
  /** A ref which, when assigned, receives a function that opens the file system file picker */
  openRef?: any
  /** Determines whether multiple files can be dropped to the dropzone or selected from file system picker @default true */
  multiple?: boolean
  /** Maximum file size in bytes */
  maxSize?: number
  /** Name of the form control. Submitted with the form as part of a name/value pair. */
  name?: string
  /** Maximum number of files that can be picked at once */
  maxFiles?: number
  /** Set to autofocus the root element */
  autoFocus?: boolean
  /** If `false`, disables click to open the native file selection dialog @default true */
  activateOnClick?: boolean
  /** If `false`, disables drag 'n' drop @default true */
  activateOnDrag?: boolean
  /** If `false`, disables Space/Enter to open the native file selection dialog @default true */
  activateOnKeyboard?: boolean
  /** If `false`, stops drag event propagation to parents @default true */
  dragEventsBubbling?: boolean
  /** Called when the `dragenter` event occurs */
  onDragEnter?: (event: DragEvent) => void
  /** Called when the `dragleave` event occurs */
  onDragLeave?: (event: DragEvent) => void
  /** Called when the `dragover` event occurs */
  onDragOver?: (event: DragEvent) => void
  /** Called when user closes the file selection dialog with no selection */
  onFileDialogCancel?: () => void
  /** Called when user opens the file selection dialog */
  onFileDialogOpen?: () => void
  /** If `false`, allow dropped items to take over the current browser window @default true */
  preventDropOnDocument?: boolean
  /** Set to true to use the File System Access API to open the file picker instead of an `input type="file"` click event @default false */
  useFsAccessApi?: boolean
  /** Use this to provide a custom file aggregator */
  getFilesFromEvent?: (event: DropEvent) => Promise<FileWithPath[]>
  /** Custom validation function. It must return null if there's no errors. */
  validator?: (file: FileWithPath) => FileError | FileError[] | null
  /** Determines whether pointer events should be enabled on the inner element @default false */
  enablePointerEvents?: boolean
  /** Props passed down to the Loader component */
  loaderProps?: Record<string, any>
  /** Props passed down to the internal input element */
  inputProps?: Record<string, any>
  variant?: DropzoneVariant
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
}

const defaultProps: Record<string, any> = {
  multiple: true,
  maxSize: Infinity,
  activateOnClick: true,
  activateOnDrag: true,
  dragEventsBubbling: true,
  activateOnKeyboard: true,
  useFsAccessApi: false,
  preventDropOnDocument: true,
  variant: 'light',
  rejectColor: 'red',
}

const varsResolver = createVarsResolver<any>(
  (theme, { radius, variant, acceptColor, rejectColor }) => {
    const acceptColors = theme.variantColorResolver({
      color: acceptColor || theme.primaryColor,
      theme,
      variant,
    })

    const rejectColors = theme.variantColorResolver({
      color: rejectColor || 'red',
      theme,
      variant,
    })

    return {
      root: {
        '--dropzone-radius': getRadius(radius),
        '--dropzone-accept-color': acceptColors.color,
        '--dropzone-accept-bg': acceptColors.background,
        '--dropzone-reject-color': rejectColors.color,
        '--dropzone-reject-bg': rejectColors.background,
      },
    }
  },
)

const DropzoneBaseComponent = defineComponent({
  name: 'Dropzone',
  inheritAttrs: false,
  props: {
    acceptColor: { type: String, default: undefined },
    rejectColor: { type: String, default: undefined },
    radius: { type: [String, Number], default: undefined },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    accept: { type: [Object, Array] as PropType<Accept | string[]>, default: undefined },
    multiple: { type: Boolean, default: undefined },
    maxSize: { type: Number, default: undefined },
    name: { type: String, default: undefined },
    maxFiles: { type: Number, default: undefined },
    autoFocus: { type: Boolean, default: false },
    activateOnClick: { type: Boolean, default: undefined },
    activateOnDrag: { type: Boolean, default: undefined },
    activateOnKeyboard: { type: Boolean, default: undefined },
    dragEventsBubbling: { type: Boolean, default: undefined },
    preventDropOnDocument: { type: Boolean, default: undefined },
    useFsAccessApi: { type: Boolean, default: undefined },
    enablePointerEvents: { type: Boolean, default: false },
    variant: { type: String as PropType<DropzoneVariant>, default: undefined },
    loaderProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    inputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    validator: {
      type: Function as PropType<(file: FileWithPath) => FileError | FileError[] | null>,
      default: undefined,
    },
    getFilesFromEvent: {
      type: Function as PropType<(event: DropEvent) => Promise<FileWithPath[]>>,
      default: undefined,
    },
    openRef: { type: [Object, Function] as PropType<any>, default: undefined },
    onDrop: { type: Function as PropType<(files: FileWithPath[]) => void>, required: true },
    onDropAny: {
      type: Function as PropType<(files: FileWithPath[], fileRejections: FileRejection[]) => void>,
      default: undefined,
    },
    onReject: {
      type: Function as PropType<(fileRejections: FileRejection[]) => void>,
      default: undefined,
    },
    onDragEnter: { type: Function as PropType<(event: DragEvent) => void>, default: undefined },
    onDragLeave: { type: Function as PropType<(event: DragEvent) => void>, default: undefined },
    onDragOver: { type: Function as PropType<(event: DragEvent) => void>, default: undefined },
    onFileDialogCancel: { type: Function as PropType<() => void>, default: undefined },
    onFileDialogOpen: { type: Function as PropType<() => void>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Dropzone', defaultProps, rawProps as any)

    const getStyles = useStyles({
      name: 'Dropzone',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      varsResolver,
      unstyled: props.unstyled,
    })

    const dz = useDropzone({
      accept: () =>
        Array.isArray(props.accept)
          ? props.accept.reduce((r: Accept, key: string) => ({ ...r, [key]: [] }), {})
          : (props.accept as Accept | undefined),
      disabled: () => props.disabled || props.loading,
      multiple: () => props.multiple,
      maxSize: () => props.maxSize,
      maxFiles: () => props.maxFiles,
      autoFocus: () => props.autoFocus,
      noClick: () => !props.activateOnClick,
      noDrag: () => !props.activateOnDrag,
      noDragEventsBubbling: () => !props.dragEventsBubbling,
      noKeyboard: () => !props.activateOnKeyboard,
      preventDropOnDocument: () => props.preventDropOnDocument,
      useFsAccessApi: () => props.useFsAccessApi,
      validator: () => props.validator,
      getFilesFromEvent: () => props.getFilesFromEvent,
      onDrop: (files, fileRejections) => props.onDropAny?.(files, fileRejections),
      onDropAccepted: (files) => props.onDrop(files),
      onDropRejected: (fileRejections) => props.onReject?.(fileRejections),
      onDragEnter: (event) => props.onDragEnter?.(event),
      onDragLeave: (event) => props.onDragLeave?.(event),
      onDragOver: (event) => props.onDragOver?.(event),
      onFileDialogCancel: () => props.onFileDialogCancel?.(),
      onFileDialogOpen: () => props.onFileDialogOpen?.(),
    })

    assignRef(props.openRef, dz.open)

    provideDropzoneContext({
      get accept() {
        return dz.isDragActive.value && dz.isDragAccept.value
      },
      get reject() {
        return dz.isDragActive.value && dz.isDragReject.value
      },
      get idle() {
        const accepted = dz.isDragActive.value && dz.isDragAccept.value
        const rejected = dz.isDragActive.value && dz.isDragReject.value
        return !accepted && !rejected
      },
    })

    return () => {
      const isAccepted = dz.isDragActive.value && dz.isDragAccept.value
      const isRejected = dz.isDragActive.value && dz.isDragReject.value
      const isIdle = !isAccepted && !isRejected

      const rootProps = dz.getRootProps()
      const inputProps = dz.getInputProps(props.inputProps)

      return h(
        Box,
        {
          ...rootProps,
          ...getStyles('root'),
          ...attrs,
          mod: [
            {
              accept: isAccepted,
              reject: isRejected,
              idle: isIdle,
              disabled: props.disabled,
              loading: props.loading,
              'activate-on-click': props.activateOnClick,
            },
            (attrs as any).mod,
          ],
        },
        () => [
          h(LoadingOverlay, {
            visible: props.loading,
            overlayProps: { radius: props.radius },
            unstyled: props.unstyled,
            loaderProps: props.loaderProps,
          }),
          h('input', { ...inputProps, name: props.name }),
          h(
            'div',
            {
              ...getStyles('inner'),
              'data-enable-pointer-events': props.enablePointerEvents || undefined,
            },
            slots.default?.(),
          ),
        ],
      )
    }
  },
})

export const Dropzone = Object.assign(withBoxProps(DropzoneBaseComponent), {
  classes,
  varsResolver,
  Accept: DropzoneAccept,
  Idle: DropzoneIdle,
  Reject: DropzoneReject,
})
