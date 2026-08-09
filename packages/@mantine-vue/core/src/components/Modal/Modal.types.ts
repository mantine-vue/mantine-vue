import type { VNodeChild } from 'vue'
import type { ClassNames, MantineNode, Styles, Vars } from '../../core'
import type { ModalBaseOwnProps } from '../ModalBase/ModalBase.types'

export type ModalStylesNames =
  | 'root'
  | 'body'
  | 'close'
  | 'content'
  | 'header'
  | 'inner'
  | 'overlay'
  | 'title'

export type ModalCssVariables = {
  root: '--modal-size' | '--modal-radius' | '--modal-y-offset' | '--modal-x-offset'
}

export type ModalFactory = {
  props: ModalProps
  stylesNames: ModalStylesNames
  vars: ModalCssVariables
}

export interface ModalSlots {
  /** Content of the modal, rendered inside `Modal.Body`. */
  default?: () => VNodeChild

  /** Title of the modal, rendered inside `Modal.Title`. */
  title?: () => VNodeChild
}

export interface ModalRootSlots {
  /** `Modal.Overlay` and `Modal.Content`. */
  default?: () => VNodeChild
}

/** Props of every compound part of `Modal` – `Modal.Body`, `Modal.Header` and so on. */
export interface ModalCompoundProps {
  /** Visible state, used by the parts that fade in and out with the modal. */
  visible?: boolean

  /** Props passed down to the `Transition` of the part. */
  transitionProps?: Record<string, any>

  /** Internal: hides the part without unmounting it. */
  __hidden?: boolean
}

/**
 * Props of `Modal.Root`.
 *
 * `Modal.Root` owns the Styles API and the layout of the modal; the behaviour comes
 * from `ModalBase`, whose props are all accepted here as well.
 *
 * Extends `ModalBaseOwnProps` rather than `ModalBaseProps`: the `Omit<BoxProps, …>` in
 * the latter is not resolvable by the SFC compiler across modules, and the `Box` props
 * reach `ModalBase` through the fallthrough attributes anyway.
 */
export interface ModalRootProps extends ModalBaseOwnProps {
  /**
   * If set, the modal is centered vertically instead of offset from the top.
   *
   * @default false
   */
  centered?: boolean

  /**
   * If set, the modal takes the whole screen.
   *
   * @default false
   */
  fullScreen?: boolean

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /**
   * Horizontal offset of the modal.
   *
   * @default '5vw'
   */
  xOffset?: string | number

  /**
   * Vertical offset of the modal. Ignored when `centered` is set.
   *
   * @default '5dvh'
   */
  yOffset?: string | number

  /**
   * Key of `theme.spacing` or any valid CSS value to set the width of the modal.
   *
   * @default 'md'
   */
  size?: string | number

  /** Component used to render the scrollable area of the content, for example `ScrollArea.Autosize`. */
  scrollAreaComponent?: any

  /** `classNames` of the Styles API. */
  classNames?: ClassNames<ModalRootProps>

  /** `styles` of the Styles API. */
  styles?: Styles<ModalRootProps>

  /** CSS variables of the Styles API. */
  vars?: Vars<ModalRootProps>
}

/**
 * Props of `Modal`.
 *
 * `Modal` is the pre-composed variant. Use `Modal.Root` and the compound components when
 * the default composition is not enough.
 */
export interface ModalProps extends ModalRootProps {
  /**
   * Title of the modal.
   * Can also be set with the `title` slot – the slot takes precedence.
   */
  title?: MantineNode

  /**
   * If set, an overlay is rendered behind the modal.
   *
   * @default true
   */
  withOverlay?: boolean

  /** Props passed down to `Modal.Overlay`. */
  overlayProps?: Record<string, any>

  /**
   * If set, a close button is rendered in the header.
   *
   * @default true
   */
  withCloseButton?: boolean

  /** Props passed down to `Modal.CloseButton`. */
  closeButtonProps?: Record<string, any>
}
