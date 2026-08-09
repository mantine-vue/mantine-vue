import type { DropzoneEmits, DropzoneProps, DropzoneStylesNames } from '../Dropzone/Dropzone.types'
export type DropzoneFullScreenStylesNames = DropzoneStylesNames | 'fullScreen'
export interface DropzoneFullScreenProps extends Omit<
  DropzoneProps,
  'variant' | 'classNames' | 'styles' | 'vars'
> {
  /** Determines whether files can be dropped onto the browser window. @default true */
  active?: boolean
  /** Z-index value. @default 9999 */
  zIndex?: string | number
  /** Determines whether the component is rendered in a Portal. @default true */
  withinPortal?: boolean
  /** Props passed to the Portal. */
  portalProps?: Record<string, any>
  classNames?: any
  styles?: any
}

/** Events emitted by `DropzoneFullScreen`. */
export type DropzoneFullScreenEmits = DropzoneEmits
