import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'

export type ChipStylesNames = 'root' | 'input' | 'iconWrapper' | 'checkIcon' | 'label'

export type ChipVariant = 'outline' | 'filled' | 'light'

export type ChipCssVariables = {
  root:
    | '--chip-fz'
    | '--chip-size'
    | '--chip-radius'
    | '--chip-checked-padding'
    | '--chip-padding'
    | '--chip-icon-size'
    | '--chip-bg'
    | '--chip-hover'
    | '--chip-color'
    | '--chip-bd'
    | '--chip-spacing'
}

export interface ChipIconSlotProps {
  /** Class name generated for the `checkIcon` selector. */
  class?: any

  /** Inline style generated for the `checkIcon` selector. */
  style?: any
}

export interface ChipSlots {
  /** Chip label. */
  default?: () => VNodeChild

  /** Checked icon. Receives the generated icon styles. */
  icon?: (props: ChipIconSlotProps) => VNodeChild
}

/** Props declared by `Chip` itself. See `ChipProps` for the full public type. */
export interface ChipOwnProps extends StylesApiProps<ChipProps> {
  /** `id` shared by the input and its label. Generated automatically when not set. */
  id?: string

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default 'xl'
   */
  radius?: MantineRadius

  /**
   * Controls the size of the chip.
   *
   * @default 'sm'
   */
  size?: MantineSize

  /**
   * Type of the underlying input. Overridden by the parent `Chip.Group`, which uses
   * `checkbox` in `multiple` mode and `radio` otherwise.
   *
   * @default 'checkbox'
   */
  type?: 'radio' | 'checkbox'

  /** Checked state, bound with `v-model`. */
  modelValue?: boolean

  /** Checked state, bound with `v-model:checked`. */
  checked?: boolean

  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean

  /**
   * Key of `theme.colors` or any valid CSS color.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /** Value used to associate the chip with the enclosing `Chip.Group`. */
  value?: string

  /**
   * Sets the `disabled` attribute on the input.
   *
   * @default false
   */
  disabled?: boolean

  /** Props passed down to the root element. */
  wrapperProps?: Record<string, any>

  /**
   * Checked icon. `null` or `false` hides it; a function receives the generated icon
   * styles. Can also be set with the scoped `icon` slot.
   */
  icon?: any

  /** Ref assigned to the root element. */
  rootRef?: any

  /**
   * If set, adjusts text color based on background color.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * Controls the visual representation of the chip.
   *
   * @default 'filled'
   */
  variant?: ChipVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface ChipProps extends Omit<BoxProps, keyof ChipOwnProps>, ChipOwnProps {}
