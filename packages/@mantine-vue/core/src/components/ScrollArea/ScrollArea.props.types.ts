import type { ScrollAreaAutosize } from './ScrollArea'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../core'

export type ScrollAreaStylesNames =
  | 'root'
  | 'viewport'
  | 'scrollbar'
  | 'thumb'
  | 'corner'
  | 'content'

export type ScrollAreaCssVariables = {
  root: '--scrollarea-scrollbar-size' | '--scrollarea-over-scroll-behavior'
}

export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover' | 'never'

export type ScrollAreaScrollbars = 'x' | 'y' | 'xy' | false

export interface ScrollAreaSlots {
  /** Scrollable content. */
  default?: () => VNodeChild
}

/** Props declared by `ScrollArea` itself. See `ScrollAreaProps` for the full public type. */
export interface ScrollAreaOwnProps extends StylesApiProps<ScrollAreaFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Width of the scrollbars in px. */
  scrollbarSize?: number | string

  /**
   * Controls when the scrollbars are visible: on hover, while scrolling, only when
   * the content overflows, always, or never.
   *
   * @default 'hover'
   */
  type?: ScrollAreaType

  /**
   * Delay in ms before the scrollbars are hidden again.
   *
   * @default 1000
   */
  scrollHideDelay?: number

  /**
   * Axes that get a scrollbar. `false` disables both.
   *
   * @default 'xy'
   */
  scrollbars?: ScrollAreaScrollbars

  /** Adds padding so the content is not covered by the scrollbars. */
  offsetScrollbars?: boolean | 'x' | 'y' | 'present'

  /** Props passed down to the viewport element. */
  viewportProps?: Record<string, any>

  /** Value of the `overscroll-behavior` CSS property applied to the viewport. */
  overscrollBehavior?: string

  /** Scroll offsets the viewport starts at. */
  startScrollPosition?: { x?: number; y?: number }

  /** Side the vertical scrollbar is rendered on. */
  verticalScrollbarPosition?: 'left' | 'right'
}

export interface ScrollAreaProps
  extends Omit<BoxProps, keyof ScrollAreaOwnProps>, ScrollAreaOwnProps {}

export interface ScrollAreaEmits {
  /** Emitted with the scroll offsets whenever the viewport scrolls. */
  'scroll-position-change': [position: { x: number; y: number }]

  /** Emitted the first time the viewport reaches the bottom. */
  'bottom-reached': []

  /** Emitted the first time the viewport reaches the top. */
  'top-reached': []

  /** Emitted the first time the viewport reaches the left edge. */
  'left-reached': []

  /** Emitted the first time the viewport reaches the right edge. */
  'right-reached': []
}

export type ScrollAreaFactory = Factory<{
  props: ScrollAreaProps
  slots: ScrollAreaSlots
  emits: ScrollAreaEmits
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: ScrollAreaStylesNames
  vars: ScrollAreaCssVariables
  staticComponents: {
    Autosize: typeof ScrollAreaAutosize
  }
}>

export type ScrollAreaAutosizeFactory = Factory<{
  props: ScrollAreaProps
  slots: ScrollAreaSlots
  emits: ScrollAreaEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ScrollAreaStylesNames
  vars: ScrollAreaCssVariables
}>
