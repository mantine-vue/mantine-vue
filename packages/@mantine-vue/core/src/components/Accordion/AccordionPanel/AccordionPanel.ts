import { withBoxProps } from '../../../core'
import AccordionPanelComponent from './AccordionPanel.vue'

export const AccordionPanel = withBoxProps(AccordionPanelComponent)
export type {
  AccordionPanelOwnProps,
  AccordionPanelProps,
  AccordionPanelSlots,
  AccordionPanelStylesNames,
} from './AccordionPanel.types'
