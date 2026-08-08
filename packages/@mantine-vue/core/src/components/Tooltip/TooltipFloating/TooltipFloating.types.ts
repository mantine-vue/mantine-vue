import type { VNodeChild } from 'vue'
import type { ClassNames, MantineNode, Styles, Vars } from '../../../core'
import type { FloatingPosition } from '../../../utils/Floating'

export interface TooltipFloatingSlots {
  /**
   * The element the tooltip follows. Must be a single element or component that accepts
   * a ref.
   */
  default?: () => VNodeChild

  /** Content of the tooltip. Takes precedence over the `label` prop. */
  label?: () => VNodeChild
}

/**
 * Props of `Tooltip.Floating`.
 *
 * Unlike `Tooltip`, this variant follows the cursor rather than anchoring to the target,
 * so it has no arrow, no transition and no open/close delays.
 */
export interface TooltipFloatingProps {
  /** Content of the tooltip. Can also be set with the `label` slot – the slot takes precedence. */
  label: MantineNode

  /**
   * Distance between the cursor and the tooltip in px.
   *
   * @default 10
   */
  offset?: number

  /**
   * Side of the cursor the tooltip is rendered on.
   *
   * @default 'right'
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

  /**
   * Initial open state, before the cursor has entered the target.
   *
   * @default false
   */
  defaultOpened?: boolean

  /**
   * If set, the tooltip can span multiple lines.
   *
   * @default false
   */
  multiline?: boolean

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Key of `theme.colors` or any valid CSS color used as the background. */
  color?: string

  /** Props passed down to the `Portal` when `withinPortal` is set. */
  portalProps?: Record<string, any>

  /** `classNames` of the Styles API. */
  classNames?: ClassNames<TooltipFloatingProps>

  /** `styles` of the Styles API. */
  styles?: Styles<TooltipFloatingProps>

  /** CSS variables of the Styles API. */
  vars?: Vars<TooltipFloatingProps>

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean
}
