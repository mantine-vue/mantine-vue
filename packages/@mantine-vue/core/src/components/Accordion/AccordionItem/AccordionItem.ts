import { withBoxProps } from '../../../core'
import AccordionItemComponent from './AccordionItem.vue'

export const AccordionItem = withBoxProps(AccordionItemComponent)

export type {
  AccordionItemOwnProps,
  AccordionItemProps,
  AccordionItemSlots,
  AccordionItemStylesNames,
} from './AccordionItem.types'
