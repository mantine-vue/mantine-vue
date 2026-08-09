import type { VNodeChild } from 'vue'
import type { ClassNames, MantineNode, Styles, Vars } from '../../core'
import type {
  ArrowPosition,
  FloatingAxesOffsets,
  FloatingPosition,
  FloatingStrategy,
} from '../../utils/Floating'

export type TooltipStylesNames = 'tooltip' | 'arrow'
export type TooltipCssVariables = '--tooltip-radius' | '--tooltip-bg' | '--tooltip-color'
export interface TooltipMiddlewares {
  /** Shifts the tooltip along its axis so it stays inside the viewport. */
  shift?: boolean | Record<string, any>

  /** Flips the tooltip to the opposite side when it does not fit. */
  flip?: boolean | Record<string, any>

  /** Improves the position for targets that span multiple lines. */
  inline?: boolean | Record<string, any>

  /** Constrains the tooltip to the available space. */
  size?: boolean | Record<string, any>
}

export interface TooltipSlots {
  /**
   * The element the tooltip is attached to. Must be a single element or component that
   * accepts a ref. Not used when `target` is set.
   */
  default?: () => VNodeChild

  /** Content of the tooltip. Takes precedence over the `label` prop. */
  label?: () => VNodeChild
}
/** Props shared by `Tooltip` and `Tooltip.Floating`. */
export interface TooltipBaseProps {
  /** Content of the tooltip. Can also be set with the `label` slot – the slot takes precedence. */
  label: MantineNode

  /**
   * Side the tooltip is rendered on.
   *
   * @default 'top'
   */
  position?: FloatingPosition

  /**
   * Name of the prop the reference ref is passed to on the child.
   *
   * @default 'ref'
   */
  refProp?: string

  /**
   * If set, the tooltip is rendered inside a `Portal`.
   *
   * @default true
   */
  withinPortal?: boolean

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Key of `theme.colors` or any valid CSS color used as the background. */
  color?: string

  /**
   * If set, the tooltip can span multiple lines.
   *
   * @default false
   */
  multiline?: boolean

  /**
   * `z-index` of the tooltip.
   *
   * @default getDefaultZIndex('popover')
   */
  zIndex?: string | number

  /**
   * If set, the tooltip is never shown.
   *
   * @default false
   */
  disabled?: boolean

  /** Props passed down to the `Portal` when `withinPortal` is set. */
  portalProps?: Record<string, any>

  /**
   * Floating UI middlewares applied to the tooltip.
   *
   * @default { flip: true, shift: true, inline: false }
   */
  middlewares?: TooltipMiddlewares

  /** `classNames` of the Styles API. */
  classNames?: ClassNames<TooltipProps>

  /** `styles` of the Styles API. */
  styles?: Styles<TooltipProps>

  /** CSS variables of the Styles API. */
  vars?: Vars<TooltipProps>

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean
}

/** Props declared by `Tooltip` on top of `TooltipBaseProps`. */
export interface TooltipProps extends TooltipBaseProps {
  /** Delay in ms before the tooltip opens. */
  openDelay?: number

  /** Delay in ms before the tooltip closes. */
  closeDelay?: number

  /** Open state of the tooltip. Controlled when set. */
  opened?: boolean

  /** Uncontrolled initial open state. */
  defaultOpened?: boolean

  /**
   * Distance between the tooltip and its target in px. Half the arrow size is added
   * automatically when `withArrow` is set.
   *
   * @default 5
   */
  offset?: number | FloatingAxesOffsets

  /**
   * If set, an arrow pointing at the target is rendered.
   *
   * @default false
   */
  withArrow?: boolean

  /**
   * Size of the arrow in px.
   *
   * @default 4
   */
  arrowSize?: number

  /**
   * Distance between the arrow and the edge of the tooltip in px.
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
   * Position of the arrow along the side of the tooltip. `merge` blends the arrow into
   * the tooltip body instead of drawing it as a separate triangle.
   *
   * @default 'side'
   */
  arrowPosition?: ArrowPosition

  /**
   * Props passed down to the `Transition`.
   *
   * @default { duration: 100, transition: 'fade' }
   */
  transitionProps?: Record<string, any>

  /**
   * Events that open and close the tooltip.
   *
   * @default { hover: true, focus: false, touch: false }
   */
  events?: { hover: boolean; focus: boolean; touch: boolean }

  /**
   * If set, the tooltip is positioned for a target that wraps across lines.
   *
   * @default false
   */
  inline?: boolean

  /**
   * If set, the tooltip stays mounted while it is closed.
   *
   * @default false
   */
  keepMounted?: boolean

  /**
   * CSS `position` strategy of the tooltip.
   *
   * @default 'absolute'
   */
  floatingStrategy?: FloatingStrategy

  /**
   * If set, adjusts the label color based on the background color.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * Element, ref or CSS selector the tooltip is attached to. Used instead of the
   * default slot when the target is not a child of the tooltip.
   */
  target?: any
}
