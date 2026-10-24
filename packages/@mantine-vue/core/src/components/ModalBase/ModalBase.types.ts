import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../core'
import type { PortalProps } from '../Portal'
import type { TransitionOverride } from '../Transition'

export interface ModalBaseSlots {
  /** Modal parts, usually `ModalBase.Overlay` and `ModalBase.Content`. */
  default?: () => VNodeChild
}

/** Props declared by `ModalBase` itself. See `ModalBaseProps` for the full public type. */
export interface ModalBaseOwnProps {
  /** Internal set used by modal and drawer stacks to handle each Escape event once. */
  __handledEscapeEvents?: WeakSet<KeyboardEvent>

  /** Open state of the modal. */
  opened: boolean

  /** Base `id` used to connect the content with its title and body. Generated when not set. */
  id?: string

  /**
   * If set, the modal stays mounted when closed and is hidden with CSS.
   *
   * @default false
   */
  keepMounted?: boolean

  /**
   * If set, scroll is locked on the body element while the modal is open.
   *
   * @default true
   */
  lockScroll?: boolean

  /**
   * If set, focus is trapped inside the modal while it is open.
   *
   * @default true
   */
  trapFocus?: boolean

  /**
   * If set, the modal is rendered inside a `Portal`.
   *
   * @default true
   */
  withinPortal?: boolean

  /** Props passed down to the `Portal` when `withinPortal` is set. */
  portalProps?: PortalProps

  /**
   * If set, the modal is closed when the overlay is clicked.
   *
   * @default true
   */
  closeOnClickOutside?: boolean

  /** Props passed down to the `Transition` used by the overlay and the content. */
  transitionProps?: TransitionOverride

  /** Called after the exit transition of the content has finished. */
  onExitTransitionEnd?: () => void

  /** Called after the enter transition of the content has finished. */
  onEnterTransitionEnd?: () => void

  /**
   * If set, the modal is closed when the `Escape` key is pressed.
   *
   * @default true
   */
  closeOnEscape?: boolean

  /**
   * If set, focus returns to the last active element when the modal is closed.
   *
   * @default true
   */
  returnFocus?: boolean

  /**
   * `z-index` of the overlay and the content.
   *
   * @default getDefaultZIndex('modal')
   */
  zIndex?: string | number

  /**
   * Key of `theme.shadows` or any valid CSS value to set the content shadow.
   *
   * @default 'xl'
   */
  shadow?: string

  /**
   * Key of `theme.spacing` or any valid CSS value to set the content padding.
   *
   * @default 'md'
   */
  padding?: string | number

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean
}

export interface ModalBaseProps
  extends Omit<BoxProps, keyof ModalBaseOwnProps>, ModalBaseOwnProps {}

export type ModalBaseFactory = Factory<{
  props: ModalBaseProps
  slots: ModalBaseSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
}>
