import { withBoxProps } from '../../../core'
import StepperStepComponent from './StepperStep.vue'
import classes from '../Stepper.module.css'

export const StepperStep = withBoxProps(StepperStepComponent)
Object.assign(StepperStep, { classes })

export type {
  StepperStepFragment,
  StepperStepFragmentSlotProps,
  StepperStepOwnProps,
  StepperStepProps,
  StepperStepSlots,
  StepperStepState,
  StepperStepStylesNames,
} from './StepperStep.types'
