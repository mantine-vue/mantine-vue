import type { VNodeChild } from 'vue'
import type { InputBaseStylesNames } from '../InputBase'
import type { MaskInputMask, MaskInputState } from './use-mask-input'

export type MaskInputStylesNames = InputBaseStylesNames

export interface MaskInputSlots {
  /** Input label. */
  label?: () => VNodeChild

  /** Description rendered below the label. */
  description?: () => VNodeChild

  /** Error message rendered below the input. */
  error?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side of the input. */
  rightSection?: () => VNodeChild
}

/**
 * Props declared by `MaskInput` itself.
 *
 * Every prop of `InputBase` is also accepted and forwarded to the underlying input.
 */
export interface MaskInputProps {
  /** Mask pattern, or a list of patterns the best match is picked from. */
  mask: MaskInputMask

  /** Masked value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial value. */
  defaultValue?: string

  /** Extra mask tokens, merged with the built-in ones. */
  tokens?: Record<string, RegExp>

  /**
   * Adjusts the mask configuration based on the current raw value, for example to switch
   * between phone number formats as the user types.
   */
  modify?: (
    value: string,
  ) => Partial<Pick<MaskInputProps, 'mask' | 'tokens' | 'slotChar' | 'separate'>> | undefined

  /**
   * If set, the literal mask characters are kept in the value rather than stripped from it.
   *
   * @default false
   */
  separate?: boolean

  /**
   * Character rendered in place of an unfilled token. `null` renders nothing.
   *
   * @default '_'
   */
  slotChar?: string | null

  /**
   * If set, the mask is always visible, even while the input is empty and unfocused.
   *
   * @default false
   */
  alwaysShowMask?: boolean

  /**
   * If set, the mask becomes visible while the input has focus.
   *
   * @default true
   */
  showMaskOnFocus?: boolean

  /** Transforms each entered character, for example to upper case it. */
  transform?: (char: string) => string

  /**
   * If set, an incomplete value is cleared when the input loses focus.
   *
   * @default false
   */
  autoClear?: boolean

  /**
   * Intercepts every value and selection change, for the cases the mask itself cannot
   * express. Receives the previous, current and proposed states and returns the state to
   * apply.
   */
  beforeMaskedStateChange?: (states: {
    previousState: MaskInputState
    currentState: MaskInputState
    nextState: MaskInputState
  }) => MaskInputState

  /** Ref assigned a function that clears the input. */
  resetRef?: any

  /** Any other prop is forwarded to the underlying `InputBase`. */
  [key: string]: any
}
