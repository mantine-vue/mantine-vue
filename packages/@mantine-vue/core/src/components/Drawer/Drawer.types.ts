import type { VNodeChild } from 'vue'
import type { MantineNode, StylesApiProps } from '../../core'
import type { ModalBaseOwnProps } from '../ModalBase/ModalBase.types'

export type DrawerPosition = 'top' | 'bottom' | 'left' | 'right'

export type DrawerStylesNames =
  | 'root'
  | 'body'
  | 'close'
  | 'content'
  | 'header'
  | 'inner'
  | 'overlay'
  | 'title'

export type DrawerCssVariables = {
  root:
    | '--drawer-size'
    | '--drawer-flex'
    | '--drawer-height'
    | '--drawer-align'
    | '--drawer-justify'
    | '--drawer-offset'
}

export type DrawerFactory = any

export interface DrawerSlots {
  /** Content of the drawer, rendered inside `Drawer.Body`. */
  default?: () => VNodeChild

  /** Title of the drawer, rendered inside `Drawer.Title`. */
  title?: () => VNodeChild
}

export interface DrawerRootSlots {
  /** `Drawer.Overlay` and `Drawer.Content`. */
  default?: () => VNodeChild
}

export interface DrawerStackSlots {
  /** The `Drawer` components that make up the stack. */
  default?: () => VNodeChild
}

/** Props of every compound part of `Drawer` – `Drawer.Body`, `Drawer.Header` and so on. */
export interface DrawerCompoundProps {
  /** Visible state, used by the parts that fade in and out with the drawer. */
  visible?: boolean

  /** Props passed down to the `Transition` of the part. */
  transitionProps?: Record<string, any>

  /** Internal: hides the part without unmounting it. */
  __hidden?: boolean
}

/**
 * Props of `Drawer.Root`.
 *
 * `Drawer.Root` owns the Styles API and the layout of the drawer; the behaviour comes
 * from `ModalBase`.
 *
 * Extends `ModalBaseOwnProps` rather than `ModalBaseProps`: the `Omit<BoxProps, …>` in
 * the latter is not resolvable by the SFC compiler across modules, and the `Box` props
 * reach `ModalBase` through the fallthrough attributes anyway.
 */
export interface DrawerRootProps
  extends Omit<ModalBaseOwnProps, 'onClose'>, StylesApiProps<DrawerRootProps> {
  /**
   * Side of the viewport the drawer slides in from.
   *
   * @default 'left'
   */
  position?: DrawerPosition

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /**
   * Key of `theme.spacing` or any valid CSS value to inset the drawer from the edges.
   *
   * @default 0
   */
  offset?: string | number

  /**
   * Key of `theme.spacing` or any valid CSS value to set the width, or the height for a
   * `top`/`bottom` drawer.
   *
   * @default 'md'
   */
  size?: string | number

  /** Component used to render the scrollable area of the content, for example `ScrollArea.Autosize`. */
  scrollAreaComponent?: any
}

/**
 * Props of `Drawer`.
 *
 * `Drawer` is the pre-composed variant. Use `Drawer.Root` and the compound components
 * when the default composition is not enough.
 */
export interface DrawerProps extends DrawerRootProps {
  /**
   * Title of the drawer.
   * Can also be set with the `title` slot – the slot takes precedence over the prop.
   */
  title?: MantineNode

  /**
   * If set, an overlay is rendered behind the drawer.
   *
   * @default true
   */
  withOverlay?: boolean

  /** Props passed down to `Drawer.Overlay`. */
  overlayProps?: Record<string, any>

  /**
   * If set, a close button is rendered in the header.
   *
   * @default true
   */
  withCloseButton?: boolean

  /** Props passed down to `Drawer.CloseButton`. */
  closeButtonProps?: Record<string, any>

  /** Id of the drawer within its `Drawer.Stack`. Required for stacked drawers. */
  stackId?: string
}
