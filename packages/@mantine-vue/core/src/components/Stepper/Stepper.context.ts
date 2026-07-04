import { createSafeContext } from '../../core'

export interface StepperContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => any
  orientation: 'horizontal' | 'vertical'
  iconPosition: 'left' | 'right'
}

export const [provideStepperContext, useStepperContext] = createSafeContext<StepperContextValue>(
  'Stepper component was not found in tree',
)
