import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { BoxProps, Factory, StylesApiProps } from '../../core'
import type { ScrollAreaProps } from '../ScrollArea'

export type TableScrollContainerStylesNames = 'scrollContainer' | 'scrollContainerInner'
export type TableScrollContainerCssVariables = {
  scrollContainer: '--table-min-width' | '--table-max-height' | '--table-overflow'
}

/** Props declared by `TableScrollContainer` itself. See `TableScrollContainerProps` for the full public type. */
export interface TableScrollContainerOwnProps extends StylesApiProps<TableScrollContainerFactory> {
  /** Receives the root DOM node -- the `ScrollArea` root, or the `div` for `type="native"`. */
  rootRef?: VueRefTarget<Element>

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

export type TableScrollContainerFactory = Factory<{
  props: Omit<TableScrollContainerProps, 'rootRef'>
  slots: TableScrollContainerSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: TableScrollContainerStylesNames
  vars: TableScrollContainerCssVariables
}>
