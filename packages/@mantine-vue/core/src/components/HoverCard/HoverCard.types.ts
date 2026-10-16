import type { VNodeChild } from 'vue'
import type { PopoverProps } from '../Popover'

export interface HoverCardSlots {
  /** `HoverCard.Target` and `HoverCard.Dropdown`. */
  default?: () => VNodeChild
}

export interface HoverCardEvents {
  /** Opens the dropdown when the target is hovered. @default true */
  hover?: boolean
  /** Opens the dropdown when the target receives keyboard focus. @default true */
  focus?: boolean
  /** Opens the dropdown when the target is tapped. Requires hover activation. @default false */
  touch?: boolean
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

  /** Events that activate the dropdown. Unspecified fields preserve their defaults. */
  events?: HoverCardEvents

  /** Keeps the dropdown open while the pointer is over it. @default false */
  interactive?: boolean

  /** Accessible relationship used between the target and dropdown. @default 'dialog' */
  role?: 'dialog' | 'tooltip'
}

/** `opened` and `onChange` are owned by `HoverCard`, which drives them from hover. */
export interface HoverCardProps
  extends Omit<PopoverProps, 'opened' | 'onChange' | keyof HoverCardOwnProps>, HoverCardOwnProps {}
