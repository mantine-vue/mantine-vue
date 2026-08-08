import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps } from '../../../core'

export type AccordionItemStylesNames = 'item'

export interface AccordionItemSlots {
  /** `Accordion.Control` and `Accordion.Panel` of the item. */
  default?: () => VNodeChild
}

/** Props declared by `AccordionItem` itself. See `AccordionItemProps` for the full public type. */
export interface AccordionItemOwnProps extends StylesApiProps<AccordionItemProps> {
  /** Value that is used to manage the accordion state. */
  value: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface AccordionItemProps
  extends Omit<BoxProps, keyof AccordionItemOwnProps>, AccordionItemOwnProps {}
