import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../core'
import type { ScrollAreaProps } from '../ScrollArea'

export type TableScrollContainerStylesNames = 'scrollContainer' | 'scrollContainerInner'
export type TableScrollContainerCssVariables = {
  scrollContainer: '--table-min-width' | '--table-max-height' | '--table-overflow'
}

/** Props declared by `TableScrollContainer` itself. See `TableScrollContainerProps` for the full public type. */
export interface TableScrollContainerOwnProps extends StylesApiProps<TableScrollContainerProps> {
  /** `min-width` at which the table becomes scrollable. */
  minWidth: string | number

  /** `max-height` at which the table becomes vertically scrollable. */
  maxHeight?: string | number

  /** Scroll container implementation. @default 'scrollarea' */
  type?: 'native' | 'scrollarea'

  /** Props passed to `ScrollArea`; not used with `type="native"`. */
  scrollAreaProps?: Partial<ScrollAreaProps> & Record<string, any>
}

export interface TableScrollContainerProps
  extends Omit<BoxProps, keyof TableScrollContainerOwnProps>, TableScrollContainerOwnProps {}

export interface TableScrollContainerSlots {
  /** Table content. */
  default?: () => VNodeChild
}
