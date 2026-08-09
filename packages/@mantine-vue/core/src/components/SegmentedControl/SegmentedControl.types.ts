import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'

export interface SegmentedControlItem<Value = string> {
  value: Value
  label: MantineNode
  disabled?: boolean
}

/** Props declared by `SegmentedControl` itself. See `SegmentedControlProps` for the full public type. */
export interface SegmentedControlOwnProps extends StylesApiProps<SegmentedControlProps> {
  /** Data based on which controls are rendered */
  data: Array<string | number | SegmentedControlItem<string | number>>

  /** Value of the controlled component, use with `v-model`. When not set, the component manages its own state. */
  modelValue?: string | number

  /** Uncontrolled component default value */
  defaultValue?: string | number

  /**
   * Determines whether the component is disabled
   *
   * @default false
   */
  disabled?: boolean

  /** Name attribute for the radio group. A random name is auto-generated if not provided */
  name?: string

  /**
   * Determines whether the component should take 100% width of its parent
   *
   * @default false
   */
  fullWidth?: boolean

  /** Key of `theme.colors` or any valid CSS color, changes indicator background color. By default, uses white in light mode and dark.5 in dark mode */
  color?: MantineColor

  /**
   * Controls `font-size`, `padding` and `height` properties
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {})

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Indicator `transition-duration` in ms, set `0` to turn off transitions
   *
   * @default 200
   */
  transitionDuration?: number

  /**
   * Indicator `transition-timing-function` property
   *
   * @default ease
   */
  transitionTimingFunction?: string

  /**
   * Component orientation
   *
   * @default 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal'

  /**
   * If set to `false`, prevents changing the value
   *
   * @default false
   */
  readOnly?: boolean

  /** If set, automatically adjusts label text color for optimal contrast against the indicator background color */
  autoContrast?: boolean

  /**
   * Determines whether there should be borders between items
   *
   * @default true
   */
  withItemsBorders?: boolean

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface SegmentedControlProps
  extends Omit<BoxProps, keyof SegmentedControlOwnProps>, SegmentedControlOwnProps {}

export type SegmentedControlStylesNames =
  | 'root'
  | 'input'
  | 'label'
  | 'control'
  | 'indicator'
  | 'innerLabel'
export type SegmentedControlCssVariables = {
  root:
    | '--sc-radius'
    | '--sc-color'
    | '--sc-font-size'
    | '--sc-padding'
    | '--sc-shadow'
    | '--sc-transition-duration'
    | '--sc-transition-timing-function'
}
