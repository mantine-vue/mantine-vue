import type { Component, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineNode,
  MantineRadius,
  MantineSize,
  SectionSlots,
  StylesApiProps,
} from '../../core'
import type { ClearSectionMode } from './InputClearSection/InputClearSection'

export type InputStylesNames = 'input' | 'wrapper' | 'section' | 'bottomSection'

export type InputVariant = 'default' | 'filled' | 'unstyled'

export type InputCssVariables = {
  wrapper:
    | '--input-height'
    | '--input-fz'
    | '--input-radius'
    | '--input-left-section-width'
    | '--input-right-section-width'
    | '--input-left-section-pointer-events'
    | '--input-right-section-pointer-events'
    | '--input-padding-y'
    | '--input-margin-top'
    | '--input-margin-bottom'
}

/** Offsets the wrapper reports so the input can leave room for a label or error. */
export interface InputStylesCtx {
  offsetTop?: boolean
  offsetBottom?: boolean
}

export interface InputSlots extends SectionSlots {
  /** Content of the input, used when `component` renders children. */
  default?: () => VNodeChild
}

/**
 * Props declared by `Input` itself. See `InputProps` for the full public type.
 *
 * The Styles API payload is deliberately left open (`StylesApiProps` without a type
 * argument): every component built on `Input` forwards its own `classNames`/`styles`
 * callbacks down, and a callback typed for one component is not assignable to a
 * callback typed for another.
 */
export interface InputOwnProps extends StylesApiProps {
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

  /** Static selector used as the base of the generated class names. */
  __staticSelector?: string

  /** Props object passed to the Styles API callbacks instead of the resolved props. */
  __stylesApiProps?: Record<string, any>

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

  /**
   * Sets the `required` attribute on the input.
   *
   * @default false
   */
  required?: boolean

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
   * Controls input height and horizontal padding.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Sets `cursor: pointer` on the input, useful for read-only comboboxes.
   *
   * @default false
   */
  pointer?: boolean

  /**
   * If set, error styles are applied when `error` is set.
   *
   * @default true
   */
  withErrorStyles?: boolean

  /** `size` attribute of the native input element. */
  inputSize?: string | number

  /** Clear button rendered in the right section when the input is clearable. */
  __clearSection?: MantineNode

  /**
   * If set, the clear section replaces or joins the right section.
   *
   * @default false
   */
  __clearable?: boolean

  /**
   * Controls how the clear section and the right section are combined.
   *
   * @default 'both'
   */
  __clearSectionMode?: ClearSectionMode

  /** Right section rendered when no `rightSection` is provided. */
  __defaultRightSection?: MantineNode

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

  /**
   * Controls the visual representation of the input.
   *
   * @default 'default'
   */
  variant?: InputVariant

  /** Error state. Any truthy value applies error styles and sets `aria-invalid`. */
  error?: any

  /**
   * If set, the input can have multiple lines, for example when `component="textarea"`.
   *
   * @default false
   */
  multiline?: boolean

  /** `id` of the input. Falls back to the id generated by the enclosing `Input.Wrapper`. */
  id?: string

  /**
   * If set, `aria-` and other accessibility attributes are added to the input.
   *
   * @default true
   */
  withAria?: boolean

  /** Props passed down to the wrapper element. */
  wrapperProps?: Record<string, any>

  /** Ref assigned to the wrapper element. */
  rootRef?: any

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface InputProps extends Omit<BoxProps, keyof InputOwnProps>, InputOwnProps {}
