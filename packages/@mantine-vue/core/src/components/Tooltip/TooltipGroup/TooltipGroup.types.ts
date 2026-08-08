import type { VNodeChild } from 'vue'

export interface TooltipGroupContextValue {
  /** Always `true`; lets a child detect that it is inside a group. */
  withinGroup: boolean

  /** Shared open delay in ms. */
  openDelay: number

  /** Shared close delay in ms. */
  closeDelay: number
}

export interface TooltipGroupSlots {
  /** `Tooltip` components that share the group delays. */
  default?: () => VNodeChild
}

/** Props declared by `TooltipGroup` itself. */
export interface TooltipGroupProps {
  /**
   * Delay in ms before the tooltip is opened.
   *
   * @default 0
   */
  openDelay?: number

  /**
   * Delay in ms before the tooltip is closed.
   *
   * @default 0
   */
  closeDelay?: number
}
