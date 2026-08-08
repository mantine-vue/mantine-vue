import { withBoxProps } from '../../core'
import StepperComponent, { varsResolver } from './Stepper.vue'
import { StepperCompleted } from './StepperCompleted/StepperCompleted'
import { StepperStep } from './StepperStep/StepperStep'
import classes from './Stepper.module.css'

export const Stepper = withBoxProps(
  Object.assign(StepperComponent, {
    classes,
    varsResolver,
    Step: StepperStep,
    Completed: StepperCompleted,
  }),
)

export type {
  StepperCssVariables,
  StepperEmits,
  StepperIconSlotProps,
  StepperOwnProps,
  StepperProps,
  StepperSlots,
  StepperStylesNames,
} from './Stepper.types'
