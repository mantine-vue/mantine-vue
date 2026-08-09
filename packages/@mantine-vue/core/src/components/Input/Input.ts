import { withBoxProps } from '../../core'
import { InputClearButton } from './InputClearButton/InputClearButton'
import { InputDescription } from './InputDescription/InputDescription'
import { InputError } from './InputError/InputError'
import { InputLabel } from './InputLabel/InputLabel'
import { InputPlaceholder } from './InputPlaceholder/InputPlaceholder'
import { InputWrapper } from './InputWrapper/InputWrapper'
import InputComponent, { varsResolver } from './Input.vue'
import classes from './Input.module.css'

export const Input = withBoxProps(
  Object.assign(InputComponent, {
    classes,
    varsResolver,
    Wrapper: InputWrapper,
    Label: InputLabel,
    Error: InputError,
    Description: InputDescription,
    Placeholder: InputPlaceholder,
    ClearButton: InputClearButton,
  }),
)

export type {
  InputCssVariables,
  InputOwnProps,
  InputProps,
  InputSlots,
  InputStylesCtx,
  InputStylesNames,
  InputVariant,
} from './Input.types'
