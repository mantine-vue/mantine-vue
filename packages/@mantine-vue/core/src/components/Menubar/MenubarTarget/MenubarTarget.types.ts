import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'

export interface MenubarTargetSlots {
  /** Label of the menu button. */
  default?: () => VNodeChild
}

/**
 * Props declared by `MenubarTarget` itself.
 * See `MenubarTargetProps` for the full public type.
 */
export interface MenubarTargetOwnProps {
  /**
   * Key of the prop used to get the element ref, useful for forwarding refs to custom
   * components.
   *
   * @default 'ref'
   */
  refProp?: string

  /**
   * Disables the target button.
   *
   * @default false
   */
  disabled?: boolean
}

export interface MenubarTargetProps
  extends Omit<BoxProps, keyof MenubarTargetOwnProps>, MenubarTargetOwnProps {}
