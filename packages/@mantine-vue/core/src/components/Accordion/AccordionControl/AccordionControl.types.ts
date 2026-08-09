import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineNode, StylesApiProps } from '../../../core'

export type AccordionControlStylesNames = 'control' | 'chevron' | 'label' | 'itemTitle' | 'icon'

export interface AccordionControlSlots {
  /** Control label. */
  default?: () => VNodeChild

  /** Custom chevron icon. Takes precedence over the `chevron` prop and the parent `Accordion` chevron. */
  chevron?: () => VNodeChild

  /** Icon displayed next to the label. Takes precedence over the `icon` prop. */
  icon?: () => VNodeChild
}

/**
 * Props declared by `AccordionControl` itself.
 * See `AccordionControlProps` for the full public type.
 */
export interface AccordionControlOwnProps extends StylesApiProps<AccordionControlProps> {
  /**
   * Sets the `disabled` attribute, prevents interactions.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Custom chevron icon. Falls back to the parent `Accordion` chevron when not set.
   * Can also be set with the `chevron` slot – the slot takes precedence.
   */
  chevron?: MantineNode

  /**
   * Icon displayed next to the label.
   * Can also be set with the `icon` slot – the slot takes precedence over the prop.
   */
  icon?: MantineNode

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface AccordionControlProps
  extends Omit<BoxProps, keyof AccordionControlOwnProps>, AccordionControlOwnProps {}
