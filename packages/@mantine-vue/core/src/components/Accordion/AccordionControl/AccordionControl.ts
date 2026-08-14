import { factory } from '../../../core'
import AccordionControlComponent from './AccordionControl.vue'
import type { AccordionControlFactory } from './AccordionControl.types'
import classes from '../Accordion.module.css'

export const AccordionControl = factory<AccordionControlFactory>(AccordionControlComponent, {
  classes,
})

export type {
  AccordionControlOwnProps,
  AccordionControlProps,
  AccordionControlSlots,
  AccordionControlStylesNames,
  AccordionControlFactory,
} from './AccordionControl.types'
