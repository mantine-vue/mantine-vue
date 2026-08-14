import { factory } from '../../../core'
import StepperStepComponent from './StepperStep.vue'
import type { StepperStepFactory } from './StepperStep.types'
import classes from '../Stepper.module.css'

export const StepperStep = factory<StepperStepFactory>(StepperStepComponent, { classes })

export type {
  StepperStepFragment,
  StepperStepFragmentSlotProps,
  StepperStepOwnProps,
  StepperStepProps,
  StepperStepSlots,
  StepperStepState,
  StepperStepStylesNames,
  StepperStepFactory,
} from './StepperStep.types'
