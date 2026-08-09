import type { VNodeChild } from 'vue'
import type { PopoverProps } from '../Popover'

export interface HoverCardSlots {
  /** `HoverCard.Target` and `HoverCard.Dropdown`. */
  default?: () => VNodeChild
}

/** Props declared by `HoverCard` itself. See `HoverCardProps` for the full public type. */
export interface HoverCardOwnProps {
  /**
   * If set, the dropdown is visible on the first render.
   *
   * @default false
   */
  initiallyOpened?: boolean

  /**
   * Delay in ms before the dropdown opens after the target is hovered.
   *
   * @default 0
   */
  openDelay?: number

  /**
   * Delay in ms before the dropdown closes after the pointer leaves.
   *
   * @default 150
   */
  closeDelay?: number
}

/** `opened` and `onChange` are owned by `HoverCard`, which drives them from hover. */
export interface HoverCardProps
  extends Omit<PopoverProps, 'opened' | 'onChange' | keyof HoverCardOwnProps>, HoverCardOwnProps {}
