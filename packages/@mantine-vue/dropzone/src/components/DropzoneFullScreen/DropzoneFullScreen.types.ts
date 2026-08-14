import type { Factory } from '@mantine-vue/core'
import type { VueRefTarget } from '@mantine-vue/hooks'
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

  /** Receives the root DOM node -- the overlay inside the portal, not the portal itself. */
  rootRef?: VueRefTarget<Element>
}

/** Events emitted by `DropzoneFullScreen`. */
export type DropzoneFullScreenEmits = DropzoneEmits

export type DropzoneFullScreenFactory = Factory<{
  props: Omit<DropzoneFullScreenProps, 'rootRef'>
  emits: DropzoneFullScreenEmits
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: DropzoneFullScreenStylesNames
}>
