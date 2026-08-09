import type { VNodeChild } from 'vue'
import type { MantineNode, MantineRadius, MantineSize, StylesApiProps } from '../../core'
import type { InputBaseOwnProps, InputBaseStylesNames } from '../InputBase'
import type { NativeSelectData } from './get-parsed-data/get-parsed-data'

export type NativeSelectStylesNames = InputBaseStylesNames

export interface NativeSelectSlots {
  /** `option` elements. Replaces the options generated from `data`. */
  default?: () => VNodeChild

  /** Input label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the input. Takes precedence over the `error` prop. */
  error?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side, replacing the default chevron. */
  rightSection?: () => VNodeChild
}

/**
 * Props declared by `NativeSelect` itself.
 * See `NativeSelectProps` for the full public type.
 */
export interface NativeSelectOwnProps extends StylesApiProps {
  /** Data used to generate the `option` elements. Ignored when the default slot is used. */
  data?: NativeSelectData<any>

  /**
   * Controls input height and horizontal padding.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Error message rendered below the input. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence over the prop.
   */
  error?: MantineNode | boolean

  /**
   * Content rendered on the right side of the input, replacing the default chevron.
   * Can also be set with the `rightSection` slot.
   */
  rightSection?: MantineNode

  /**
   * Sets `pointer-events` on the right section.
   *
   * @default 'none'
   */
  rightSectionPointerEvents?: string

  /**
   * Input label.
   * Can also be set with the `label` slot – the slot takes precedence over the prop.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence over the prop.
   */
  description?: MantineNode

  /**
   * Adds the required attribute to the select and a red asterisk to the label.
   *
   * @default false
   */
  required?: boolean

  /**
   * Sets the `disabled` attribute on the select.
   *
   * @default false
   */
  disabled?: boolean

  /** `id` shared by the select and its label. Generated automatically when not set. */
  id?: string

  /** `name` of the select, submitted with the enclosing form. */
  name?: string

  /** `form` the select belongs to. */
  form?: string

  /** Selected value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial selected value. */
  defaultValue?: string

  /** Controls the visual representation of the input. */
  variant?: 'default' | 'filled' | 'unstyled'

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius
}

/** Every prop `NativeSelect` does not declare is forwarded to `InputBase`. */
export interface NativeSelectProps
  extends
    Omit<InputBaseOwnProps, keyof NativeSelectOwnProps | 'component' | 'pointer'>,
    NativeSelectOwnProps {}
