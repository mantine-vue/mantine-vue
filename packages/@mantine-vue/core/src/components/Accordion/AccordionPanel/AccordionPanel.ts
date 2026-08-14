import { factory } from '../../../core'
import type { AccordionPanelFactory } from './AccordionPanel.types'
import AccordionPanelComponent from './AccordionPanel.vue'
import classes from '../Accordion.module.css'

export const AccordionPanel = factory<AccordionPanelFactory>(AccordionPanelComponent, { classes })
export type {
  AccordionPanelFactory,
  AccordionPanelOwnProps,
  AccordionPanelProps,
  AccordionPanelSlots,
  AccordionPanelStylesNames,
} from './AccordionPanel.types'
