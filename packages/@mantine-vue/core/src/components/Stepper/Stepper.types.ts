import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'

export type StepperStylesNames =
  | 'root'
  | 'separator'
  | 'steps'
  | 'content'
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

export type StepperCssVariables = {
  root:
    | '--stepper-color'
    | '--stepper-icon-color'
    | '--stepper-icon-size'
    | '--stepper-content-padding'
    | '--stepper-radius'
    | '--stepper-fz'
    | '--stepper-spacing'
}

/** Payload passed to the icon slots of `Stepper`. */
export interface StepperIconSlotProps {
  /** Zero based index of the step the icon is rendered for. */
  step: number
}

export interface StepperSlots {
  /** `Stepper.Step` and `Stepper.Completed` children. */
  default?: () => VNodeChild

  /** Icon used by every step. A step level icon takes precedence. */
  icon?: (props: StepperIconSlotProps) => VNodeChild

  /** Icon used by every completed step. A step level icon takes precedence. */
  completedIcon?: (props: StepperIconSlotProps) => VNodeChild

  /** Icon used by the active step. A step level icon takes precedence. */
  progressIcon?: (props: StepperIconSlotProps) => VNodeChild
}

/** Props declared by `Stepper` itself. See `StepperProps` for the full public type. */
export interface StepperOwnProps extends StylesApiProps<StepperProps> {
  /** Zero based index of the active step, bound with `v-model:active`. */
  active: number

  /**
   * Icon used by every step.
   * Can also be set with the scoped `icon` slot – a step level icon takes precedence over both.
   */
  icon?: MantineNode | ((payload: StepperIconSlotProps) => VNodeChild)

  /**
   * Icon used by every completed step.
   * Can also be set with the scoped `completedIcon` slot.
   */
  completedIcon?: MantineNode | ((payload: StepperIconSlotProps) => VNodeChild)

  /**
   * Icon used by the active step.
   * Can also be set with the scoped `progressIcon` slot.
   */
  progressIcon?: MantineNode | ((payload: StepperIconSlotProps) => VNodeChild)

  /**
   * Key of `theme.colors` or any valid CSS color used by the active and completed steps.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /** Size of the step icon in px. Calculated from `size` when not set. */
  iconSize?: string | number

  /** Key of `theme.spacing` or any valid CSS value to set the content padding. */
  contentPadding?: string | number

  /**
   * Direction the steps are laid out in.
   *
   * @default 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal'

  /**
   * Side the step icon is rendered on.
   *
   * @default 'left'
   */
  iconPosition?: 'right' | 'left'

  /** Controls the size of the steps. */
  size?: MantineSize

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: MantineRadius

  /**
   * If set, steps after the active one can be selected.
   *
   * @default true
   */
  allowNextStepsSelect?: boolean

  /**
   * If set, steps wrap onto the next line when they do not fit. Ignored when
   * `orientation` is `vertical`.
   *
   * @default true
   */
  wrap?: boolean

  /**
   * If set, adjusts the icon color based on the background color.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * If set, the content of inactive steps stays mounted and is hidden with CSS.
   *
   * @default false
   */
  keepMounted?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface StepperProps extends Omit<BoxProps, keyof StepperOwnProps>, StepperOwnProps {}

export interface StepperEmits {
  /** Emitted with the next active step index, bound with `v-model:active`. */
  'update:active': [index: number]

  /** Emitted with the step index when a step is clicked. */
  'step-click': [index: number]
}
