import PasswordInputComponent, { mergedClasses, varsResolver } from './PasswordInput.vue'

export const PasswordInput = Object.assign(PasswordInputComponent, {
  classes: mergedClasses,
  varsResolver,
})

export type {
  PasswordInputCssVariables,
  PasswordInputOwnProps,
  PasswordInputProps,
  PasswordInputSlots,
  PasswordInputStylesNames,
  PasswordInputToggleIconSlotProps,
} from './PasswordInput.types'
