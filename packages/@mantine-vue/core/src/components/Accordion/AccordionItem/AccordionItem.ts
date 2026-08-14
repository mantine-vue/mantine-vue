import { factory } from '../../../core'
import AccordionItemComponent from './AccordionItem.vue'
import type { AccordionItemFactory } from './AccordionItem.types'

export const AccordionItem = factory<AccordionItemFactory>(AccordionItemComponent)

export type {
  AccordionItemOwnProps,
  AccordionItemProps,
  AccordionItemSlots,
  AccordionItemStylesNames,
  AccordionItemFactory,
} from './AccordionItem.types'
