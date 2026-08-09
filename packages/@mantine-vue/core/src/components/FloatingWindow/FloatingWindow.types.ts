import type { Ref, VNodeChild } from 'vue'
import type { FloatingWindowPositionConfig, SetFloatingWindowPosition } from '@mantine-vue/hooks'
import type { BoxMod, BoxProps, StylesApiProps } from '../../core'
import type { FloatingWindowDimensions } from './FloatingWindow.context'

export type FloatingWindowStylesNames = 'root'

export interface FloatingWindowSlots {
  /** Content of the window, usually including a `FloatingWindow.ResizeHandle`. */
  default?: () => VNodeChild
}

/** Props declared by `FloatingWindow` itself. See `FloatingWindowProps` for the full public type. */
export interface FloatingWindowOwnProps extends StylesApiProps<FloatingWindowProps> {
  /**
   * If set, the window can be dragged.
   *
   * @default true
   */
  enabled?: boolean

  /**
   * If set, the window cannot be dragged outside the viewport.
   *
   * @default true
   */
  constrainToViewport?: boolean

  /** Margin in px kept between the window and the viewport edges. */
  constrainOffset?: number

  /** CSS selector of the element that starts a drag. The whole window drags when not set. */
  dragHandleSelector?: string

  /** CSS selector of elements inside the drag handle that must not start a drag. */
  excludeDragHandleSelector?: string

  /** Restricts dragging to a single axis. */
  axis?: 'x' | 'y'

  /** Position the window starts at. */
  initialPosition?: FloatingWindowPositionConfig

  /** Ref assigned a function that moves the window programmatically. */
  setPositionRef?: Ref<SetFloatingWindowPosition | null>

  /**
   * If set, the window is rendered inside a `Portal`.
   *
   * @default true
   */
  withinPortal?: boolean

  /** Props passed down to the `Portal` when `withinPortal` is set. */
  portalProps?: Record<string, any>

  /**
   * `z-index` of the window.
   *
   * @default getDefaultZIndex('overlay')
   */
  zIndex?: string | number

  /** Initial size and the bounds the window can be resized within. */
  dimensions?: FloatingWindowDimensions

  /** Key of `theme.shadows` or any valid CSS value to set the shadow. */
  shadow?: string

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /**
   * If set, the window has a border.
   *
   * @default false
   */
  withBorder?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface FloatingWindowProps
  extends Omit<BoxProps, keyof FloatingWindowOwnProps>, FloatingWindowOwnProps {}
