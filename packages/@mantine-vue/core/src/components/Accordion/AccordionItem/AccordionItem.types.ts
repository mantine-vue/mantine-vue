import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps, Factory } from '../../../core'

export type AccordionItemStylesNames = 'item'

export interface AccordionItemSlots {
  /** `Accordion.Control` and `Accordion.Panel` of the item. */
  default?: () => VNodeChild
}

/** Props declared by `AccordionItem` itself. See `AccordionItemProps` for the full public type. */
export interface AccordionItemOwnProps extends StylesApiProps<AccordionItemFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Value that is used to manage the accordion state. */
  value: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface AccordionItemProps
  extends Omit<BoxProps, keyof AccordionItemOwnProps>, AccordionItemOwnProps {}

export type AccordionItemFactory = Factory<{
  props: Omit<AccordionItemProps, 'rootRef'>
  ref: HTMLDivElement
  slots: AccordionItemSlots
  element: 'div'
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
