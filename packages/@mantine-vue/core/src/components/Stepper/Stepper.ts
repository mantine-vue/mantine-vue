import { factory } from '../../core'
import StepperComponent, { varsResolver } from './Stepper.vue'
import type { StepperFactory } from './Stepper.types'
import { StepperCompleted } from './StepperCompleted/StepperCompleted'
import { StepperStep } from './StepperStep/StepperStep'
import classes from './Stepper.module.css'

export const Stepper = factory<StepperFactory>(StepperComponent, {
  classes,
  varsResolver,
  Step: StepperStep,
  Completed: StepperCompleted,
})

export type {
  StepperCssVariables,
  StepperEmits,
  StepperIconSlotProps,
  StepperOwnProps,
  StepperProps,
  StepperSlots,
  StepperStylesNames,
  StepperFactory,
} from './Stepper.types'
