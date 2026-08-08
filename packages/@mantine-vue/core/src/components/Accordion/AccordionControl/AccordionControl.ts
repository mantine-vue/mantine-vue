import { withBoxProps } from '../../../core'
import AccordionControlComponent from './AccordionControl.vue'
import classes from '../Accordion.module.css'

export const AccordionControl = withBoxProps(Object.assign(AccordionControlComponent, { classes }))

export type {
  AccordionControlOwnProps,
  AccordionControlProps,
  AccordionControlSlots,
  AccordionControlStylesNames,
} from './AccordionControl.types'
