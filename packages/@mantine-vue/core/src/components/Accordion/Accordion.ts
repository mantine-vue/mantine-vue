import AccordionComponent, { varsResolver } from './Accordion.vue'
import { AccordionChevron } from './AccordionChevron'
import { AccordionControl } from './AccordionControl/AccordionControl'
import { AccordionItem } from './AccordionItem/AccordionItem'
import { AccordionPanel } from './AccordionPanel/AccordionPanel'
import classes from './Accordion.module.css'

export const Accordion = Object.assign(AccordionComponent, {
  classes,
  varsResolver,
  Item: AccordionItem,
  Panel: AccordionPanel,
  Control: AccordionControl,
  Chevron: AccordionChevron,
})

export type {
  AccordionCssVariables,
  AccordionOwnProps,
  AccordionProps,
  AccordionSlots,
  AccordionStylesNames,
  AccordionVariant,
} from './Accordion.types'
