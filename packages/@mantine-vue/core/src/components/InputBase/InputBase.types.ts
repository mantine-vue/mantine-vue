import type { Component, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineNode,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'
import type { InputSlots } from '../Input/Input'

export type InputBaseStylesNames =
  | 'input'
  | 'wrapper'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'

export type InputBaseVariant = 'default' | 'filled' | 'unstyled'

export interface InputBaseSlots extends InputSlots {
  /** Input label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the input. Takes precedence over the `error` prop. */
  error?: () => VNodeChild
}

/** Props declared by `InputBase` itself. See `InputBaseProps` for the full public type. */
export interface InputBaseOwnProps extends StylesApiProps<InputBaseProps> {
  /**
   * Element or component rendered as the input.
   *
   * @default 'input'
   */
  component?: string | Component

  /** Controlled value, bound with `v-model`. */
  modelValue?: any

  /** Uncontrolled initial value. */
  defaultValue?: any

  /**
   * Static selector used as the base of the generated class names.
   *
   * @default 'InputBase'
   */
  __staticSelector?: string

  /** Props object passed to the Styles API callbacks instead of the resolved props. */
  __stylesApiProps?: Record<string, any>

  /**
   * Input label.
   * Can also be set with the `label` slot – the slot takes precedence.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence.
   */
  description?: MantineNode

  /**
   * Error message rendered below the input. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence.
   */
  error?: MantineNode | boolean

  /**
   * Adds the required attribute to the input and a red asterisk to the label.
   *
   * @default false
   */
  required?: boolean

  /**
   * Adds the red asterisk to the label without setting the input `required` attribute.
   * Inherits `required` when not set.
   */
  withAsterisk?: boolean

  /** Props passed down to the `Input.Label` component. */
  labelProps?: Record<string, any>

  /** Props passed down to the `Input.Description` component. */
  descriptionProps?: Record<string, any>

  /** Props passed down to the `Input.Error` component. */
  errorProps?: Record<string, any>

  /** Function that renders the input around the given children. */
  inputContainer?: (children: any) => any

  /**
   * Order of the elements inside the wrapper.
   *
   * @default ['label', 'description', 'input', 'error']
   */
  inputWrapperOrder?: Array<'label' | 'input' | 'description' | 'error'>

  /** `id` shared by the input, label, description and error elements. Generated when not set. */
  id?: string

  /**
   * Controls input height and horizontal padding.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Element rendered as the label.
   *
   * @default 'label'
   */
  labelElement?: 'label' | 'div'

  /**
   * Controls the visual representation of the input.
   *
   * @default 'default'
   */
  variant?: InputBaseVariant

  /** Props passed down to the root element (`Input.Wrapper` component). */
  wrapperProps?: Record<string, any>

  /**
   * If set, the input can have multiple lines, for example when `component="textarea"`.
   *
   * @default false
   */
  multiline?: boolean

  /**
   * If set, `aria-` and other accessibility attributes are added to the input.
   *
   * @default true
   */
  withAria?: boolean

  /**
   * Content rendered on the left side of the input.
   * Can also be set with the `leftSection` slot – the slot takes precedence over the prop.
   */
  leftSection?: MantineNode

  /** Width of the left section. */
  leftSectionWidth?: string | number

  /** Props passed down to the left section element. */
  leftSectionProps?: Record<string, any>

  /**
   * Sets `pointer-events` on the left section.
   *
   * @default 'none'
   */
  leftSectionPointerEvents?: string

  /**
   * Content rendered on the right side of the input.
   * Can also be set with the `rightSection` slot – the slot takes precedence over the prop.
   */
  rightSection?: MantineNode

  /** Width of the right section. */
  rightSectionWidth?: string | number

  /** Props passed down to the right section element. */
  rightSectionProps?: Record<string, any>

  /**
   * Sets `pointer-events` on the right section.
   *
   * @default 'none'
   */
  rightSectionPointerEvents?: string

  /** Clear button rendered in the right section when the input is clearable. */
  __clearSection?: MantineNode

  /**
   * If set, the clear section replaces or joins the right section.
   *
   * @default false
   */
  __clearable?: boolean

  /** Controls how the clear section and right section are combined. */
  __clearSectionMode?: 'both' | 'rightSection' | 'clear'

  /** Right section rendered when no `rightSection` is provided. */
  __defaultRightSection?: MantineNode

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Sets the `disabled` attribute on the input.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Sets `cursor: pointer` on the input, useful for read-only comboboxes.
   *
   * @default false
   */
  pointer?: boolean

  /**
   * If set, error styles are applied to the input when `error` is set.
   *
   * @default true
   */
  withErrorStyles?: boolean

  /** `size` attribute of the native input element. */
  inputSize?: string | number

  /**
   * If set, a loader is displayed in one of the input sections.
   *
   * @default false
   */
  loading?: boolean

  /**
   * Section the loader is displayed in when `loading` is set.
   *
   * @default 'right'
   */
  loadingPosition?: 'left' | 'right'

  /** Content rendered at the bottom of the input, inside the border. */
  __bottomSection?: MantineNode

  /** Props passed down to the `__bottomSection` element. */
  __bottomSectionProps?: Record<string, any>

  /** Ref assigned to the input root element. */
  rootRef?: any

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface InputBaseProps
  extends Omit<BoxProps, keyof InputBaseOwnProps>, InputBaseOwnProps {}
