import type { VNodeChild } from 'vue'

export interface HoverCardGroupContextValue {
  /** Always `true`; lets a child detect that it is inside a group. */
  withinGroup: boolean

  /** Shared open delay in ms. */
  openDelay: number

  /** Shared close delay in ms. */
  closeDelay: number
}

export interface HoverCardGroupSlots {
  /** `HoverCard` components that share the group delays. */
  default?: () => VNodeChild
}

/** Props declared by `HoverCardGroup` itself. */
export interface HoverCardGroupProps {
  /**
   * Delay in ms before the hover card is opened.
   *
   * @default 0
   */
  openDelay?: number

  /**
   * Delay in ms before the hover card is closed.
   *
   * @default 0
   */
  closeDelay?: number
}
