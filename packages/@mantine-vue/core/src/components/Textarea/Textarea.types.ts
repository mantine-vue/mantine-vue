import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode } from '../../core'
import type { InputBaseOwnProps, InputBaseSlots, InputBaseStylesNames } from '../InputBase'

export type TextareaStylesNames = InputBaseStylesNames

export interface TextareaSlots extends InputBaseSlots {
  /** Content rendered below the textarea, inside the border. Alternative to the `bottomSection` prop. */
  bottomSection?: () => VNodeChild
}

/** Props declared by `Textarea` itself. See `TextareaProps` for the full public type. */
export interface TextareaOwnProps {
  /** Controlled value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial value. */
  defaultValue?: string

  /**
   * If set, enables textarea height growing with its content.
   *
   * @default false
   */
  autosize?: boolean

  /** Maximum rows for the autosize textarea to grow, ignored if `autosize` is not set. */
  maxRows?: number

  /**
   * Minimum rows of the autosize textarea. Used as the `rows` attribute when
   * `autosize` is not set.
   */
  minRows?: number

  /**
   * Controls the `resize` CSS property.
   *
   * @default 'none'
   */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'

  /**
   * Content rendered at the bottom of the input, inside the border.
   * Can also be set with the `bottomSection` slot – the slot takes precedence.
   */
  bottomSection?: MantineNode

  /** Props passed down to the `bottomSection` element. */
  bottomSectionProps?: Record<string, any>

  /**
   * Static selector used as the base of the generated class names.
   *
   * @default 'Textarea'
   */
  __staticSelector?: string
}

export interface TextareaProps
  extends
    Omit<BoxProps, keyof TextareaOwnProps | keyof InputBaseOwnProps>,
    Omit<InputBaseOwnProps, keyof TextareaOwnProps | 'component' | 'multiline'>,
    TextareaOwnProps {}
