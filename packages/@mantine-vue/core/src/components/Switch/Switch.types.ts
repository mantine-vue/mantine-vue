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

export type SwitchStylesNames =
  | 'root'
  | 'track'
  | 'trackLabel'
  | 'thumb'
  | 'input'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'

export type SwitchCssVariables = {
  root:
    | '--switch-radius'
    | '--switch-height'
    | '--switch-width'
    | '--switch-thumb-size'
    | '--switch-label-font-size'
    | '--switch-track-label-padding'
    | '--switch-color'
}

export interface SwitchSlots {
  /** Switch label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the label. Takes precedence over the `error` prop. */
  error?: () => VNodeChild

  /** Icon rendered inside the thumb. Takes precedence over the `thumbIcon` prop. */
  thumbIcon?: () => VNodeChild

  /** Label rendered inside the track when checked. Takes precedence over the `onLabel` prop. */
  onLabel?: () => VNodeChild

  /** Label rendered inside the track when unchecked. Takes precedence over the `offLabel` prop. */
  offLabel?: () => VNodeChild
}

/** Props declared by `Switch` itself. See `SwitchProps` for the full public type. */
export interface SwitchOwnProps extends StylesApiProps<SwitchProps> {
  /** `id` shared by the input and its label. Generated automatically when not set. */
  id?: string

  /**
   * Content of the label.
   * Can also be set with the `label` slot – the slot takes precedence.
   */
  label?: MantineNode

  /**
   * Inner label rendered when the switch is unchecked.
   * Can also be set with the `offLabel` slot – the slot takes precedence.
   */
  offLabel?: MantineNode

  /**
   * Inner label rendered when the switch is checked.
   * Can also be set with the `onLabel` slot – the slot takes precedence.
   */
  onLabel?: MantineNode

  /**
   * Key of `theme.colors` or any valid CSS color used for the checked track.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls the size of the switch. Falls back to the size set on the parent
   * `Switch.Group`.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {})

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default 'xl'
   */
  radius?: MantineRadius

  /** Props passed down to the root element. */
  wrapperProps?: Record<string, any>

  /**
   * Icon rendered inside the thumb.
   * Can also be set with the `thumbIcon` slot – the slot takes precedence.
   */
  thumbIcon?: MantineNode

  /**
   * Position of the label relative to the switch.
   *
   * @default 'right'
   */
  labelPosition?: 'left' | 'right'

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence.
   */
  description?: MantineNode

  /**
   * Error message rendered below the label. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence.
   */
  error?: MantineNode | boolean

  /** Ref assigned to the root element. */
  rootRef?: any

  /**
   * If set, the thumb displays an indicator when the switch is unchecked.
   * Ignored when `thumbIcon` is set.
   *
   * @default true
   */
  withThumbIndicator?: boolean

  /** Checked state, bound with `v-model`. */
  modelValue?: boolean

  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean

  /**
   * Sets the `disabled` attribute on the input.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the checked state cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /** Controls the visual representation of the switch. */
  variant?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface SwitchProps extends Omit<BoxProps, keyof SwitchOwnProps>, SwitchOwnProps {}
