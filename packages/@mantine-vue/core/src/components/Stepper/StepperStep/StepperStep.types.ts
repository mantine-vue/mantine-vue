import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineColor, MantineNode, StylesApiProps } from '../../../core'

export interface StepperStepFragmentSlotProps {
  /** Zero-based step index. */
  step: number
}

export type StepperStepFragment =
  | MantineNode
  | ((payload: StepperStepFragmentSlotProps) => VNodeChild)
export type StepperStepState = 'stepInactive' | 'stepProgress' | 'stepCompleted'
export type StepperStepStylesNames =
  | 'step'
  | 'stepLoader'
  | 'verticalSeparator'
  | 'stepWrapper'
  | 'stepIcon'
  | 'stepCompletedIcon'
  | 'stepIconContent'
  | 'stepBody'
  | 'stepLabel'
  | 'stepDescription'

/** Props declared by `StepperStep` itself. See `StepperStepProps` for the full public type. */
export interface StepperStepOwnProps {
  /** 0-based step index, automatically set by Stepper component */
  step?: number

  /** Step state, automatically set by Stepper component based on active prop. stepInactive: not reached, stepProgress: current, stepCompleted: passed */
  state?: StepperStepState

  /** Key of `theme.colors`, by default controlled by Stepper component */
  color?: MantineColor

  /**
   * When false, hides the step icon. Useful for creating compact steppers with only labels
   *
   * @default true
   */
  withIcon?: boolean

  /** Step icon, defaults to `step index + 1` when rendered within Stepper */
  icon?: StepperStepFragment

  /** Step icon displayed when step is completed */
  completedIcon?: StepperStepFragment

  /** Step icon displayed when step is in progress */
  progressIcon?: StepperStepFragment

  /** Step label, render after icon */
  label?: StepperStepFragment

  /** Step description */
  description?: StepperStepFragment

  /** Icon wrapper size */
  iconSize?: string | number

  /**
   * Icon position relative to step body, controlled by Stepper component
   *
   * @default 'left'
   */
  iconPosition?: 'right' | 'left'

  /**
   * Indicates loading state of the step
   *
   * @default false
   */
  loading?: boolean

  /**
   * Set to false to disable clicks on step
   *
   * @default true
   */
  allowStepClick?: boolean

  /** Should step selection be allowed */
  allowStepSelect?: boolean

  /** Component orientation */
  orientation?: 'vertical' | 'horizontal'

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to Stepper elements. */
  classNames?: StylesApiProps<StepperStepProps>['classNames']

  /** Inline styles applied to Stepper elements. */
  styles?: StylesApiProps<StepperStepProps>['styles']

  /** Class added to the root element, if applicable */
  className?: any

  /** Inline style added to root component element, can subscribe to theme defined on MantineProvider */
  style?: any
}

export interface StepperStepSlots {
  /** Step icon. */
  icon?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  /** Icon displayed for a completed step. */
  completedIcon?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  /** Icon displayed for the active step. */
  progressIcon?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  /** Step label. */
  label?: (payload: StepperStepFragmentSlotProps) => VNodeChild
  /** Step description. */
  description?: (payload: StepperStepFragmentSlotProps) => VNodeChild
}

export interface StepperStepProps
  extends Omit<BoxProps, keyof StepperStepOwnProps>, StepperStepOwnProps {}
