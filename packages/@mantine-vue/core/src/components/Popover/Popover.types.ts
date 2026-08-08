import type { VNodeChild } from 'vue'
import type { FlipOptions, InlineOptions, ShiftOptions, SizeOptions } from '@floating-ui/vue'
import type { ClassNames, Styles, Vars } from '../../core'
import type {
  ArrowPosition,
  FloatingAxesOffsets,
  FloatingPosition,
  FloatingStrategy,
} from '../../utils/Floating'

export type PopoverStylesNames = 'dropdown' | 'arrow' | 'overlay'

export type PopoverCssVariables = '--popover-radius' | '--popover-shadow'

/** `target` matches the width of the target element; anything else is a CSS width. */
export type PopoverWidth = 'target' | string | number | null

export interface PopoverMiddlewares {
  /** Shifts the dropdown along its axis so it stays inside the viewport. */
  shift?: boolean | ShiftOptions

  /** Flips the dropdown to the opposite side when it does not fit. */
  flip?: boolean | FlipOptions

  /** Improves the position for targets that span multiple lines. */
  inline?: boolean | InlineOptions

  /** Constrains the dropdown to the available space. */
  size?: boolean | SizeOptions
}

export interface PopoverSlots {
  /** `Popover.Target` and `Popover.Dropdown`. */
  default?: () => VNodeChild
}

export interface PopoverTargetSlots {
  /** The element the dropdown is anchored to. Must be a single element or component that accepts a ref. */
  default?: () => VNodeChild
}

export interface PopoverDropdownSlots {
  /** Content of the dropdown. */
  default?: () => VNodeChild
}

export interface PopoverContextMenuSlots {
  /** The element that opens the popover on right click or long press. */
  default?: () => VNodeChild
}

/** Props of `Popover`. */
export interface PopoverProps {
  /** Static selector the Styles API classes are generated from. Used by components built on `Popover`. */
  __staticSelector?: string

  /**
   * Side the dropdown is rendered on.
   *
   * @default 'bottom'
   */
  position?: FloatingPosition

  /**
   * Distance between the dropdown and its target in px. Half the arrow size is added
   * automatically when `withArrow` is set.
   *
   * @default 8
   */
  offset?: number | FloatingAxesOffsets

  /** Open state. Controlled when set, bound with `v-model:opened`. */
  opened?: boolean

  /** Uncontrolled initial open state. */
  defaultOpened?: boolean

  /**
   * Width of the dropdown. `target` matches the target element.
   *
   * @default 'max-content'
   */
  width?: PopoverWidth

  /**
   * If set, an arrow pointing at the target is rendered.
   *
   * @default false
   */
  withArrow?: boolean

  /**
   * Size of the arrow in px.
   *
   * @default 7
   */
  arrowSize?: number

  /**
   * Distance between the arrow and the edge of the dropdown in px.
   *
   * @default 5
   */
  arrowOffset?: number

  /**
   * `border-radius` of the arrow in px.
   *
   * @default 0
   */
  arrowRadius?: number

  /**
   * Position of the arrow along the side of the dropdown. `merge` blends the arrow into
   * the dropdown body instead of drawing it as a separate triangle.
   *
   * @default 'side'
   */
  arrowPosition?: ArrowPosition

  /**
   * If set, the dropdown is rendered inside a `Portal`.
   *
   * @default true
   */
  withinPortal?: boolean

  /** Props passed down to the `Portal` when `withinPortal` is set. */
  portalProps?: Record<string, any>

  /**
   * If set, the dropdown closes on a click outside the target and the dropdown.
   *
   * @default true
   */
  closeOnClickOutside?: boolean

  /**
   * If set, the dropdown closes when `Escape` is pressed inside it.
   *
   * @default true
   */
  closeOnEscape?: boolean

  /**
   * If set, focus is trapped inside the dropdown while it is open.
   *
   * @default false
   */
  trapFocus?: boolean

  /**
   * If set, the target and the dropdown get the ARIA roles that describe the
   * relationship between them.
   *
   * @default true
   */
  withRoles?: boolean

  /**
   * If set, the dropdown never opens.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, focus returns to the target when the dropdown closes.
   *
   * @default false
   */
  returnFocus?: boolean

  /**
   * If set, the dropdown stays mounted while it is closed.
   *
   * @default false
   */
  keepMounted?: boolean

  /**
   * Props passed down to the `Transition`.
   *
   * @default { transition: 'fade', duration: 150 }
   */
  transitionProps?: Record<string, any>

  /**
   * `z-index` of the dropdown.
   *
   * @default getDefaultZIndex('popover')
   */
  zIndex?: string | number

  /**
   * CSS `position` strategy of the dropdown.
   *
   * @default 'absolute'
   */
  floatingStrategy?: FloatingStrategy

  /**
   * Floating UI middlewares applied to the dropdown.
   *
   * @default { flip: true, shift: true }
   */
  middlewares?: PopoverMiddlewares

  /** Base `id` used to connect the target with the dropdown. Generated when not set. */
  id?: string

  /** Props merged into the target element. */
  targetProps?: Record<string, any>

  /**
   * If set, an overlay is rendered behind the dropdown.
   *
   * @default false
   */
  withOverlay?: boolean

  /** Props passed down to the `Overlay`. */
  overlayProps?: Record<string, any>

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Key of `theme.shadows` or any valid CSS value to set the shadow. */
  shadow?: string

  /** `classNames` of the Styles API. */
  classNames?: ClassNames<PopoverProps>

  /** `styles` of the Styles API. */
  styles?: Styles<PopoverProps>

  /** CSS variables of the Styles API. */
  vars?: Vars<PopoverProps>

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean
}

/** Props of `Popover.Target`. */
export interface PopoverTargetProps {
  /**
   * Name of the prop the reference ref is passed to on the child.
   *
   * @default 'ref'
   */
  refProp?: string

  /**
   * Value of `aria-haspopup` set on the target. Only used when `withRoles` is set.
   *
   * @default 'dialog'
   */
  popupType?: string

  /** Any other prop is merged into the cloned child. */
  [key: string]: any
}

/** Props of `Popover.Dropdown`. Every prop is forwarded to the dropdown element. */
export interface PopoverDropdownProps {
  [key: string]: any
}

/** Props of `Popover.ContextMenu`. */
export interface PopoverContextMenuProps {
  /**
   * If set, the context menu does not open.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Time in ms a touch has to be held before the menu opens.
   *
   * @default 500
   */
  longPressDelay?: number

  /** Any other prop is merged into the cloned child. */
  [key: string]: any
}
