import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineRadius,
  MantineSize,
  StylesApiProps,
  PolymorphicFactory,
  MantineElementType,
} from '../../core'
import type { ActionIconGroup } from './ActionIconGroup/ActionIconGroup'
import type { ActionIconGroupSection } from './ActionIconGroupSection/ActionIconGroupSection'

export type ActionIconVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'subtle'
  | 'default'
  | 'gradient'

/** Props declared by `ActionIcon` itself. See `ActionIconProps` for the full public type. */
export interface ActionIconOwnProps extends StylesApiProps<ActionIconProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /**
   * Root element or component rendered by `ActionIcon`.
   *
   * @default 'button'
   */
  component?: MantineElementType

  /**
   * If set, `Loader` component is displayed instead of the `children`
   *
   * @default false
   */
  loading?: boolean

  /** Props passed down to the `Loader` component. Ignored when `loading` prop is not set. */
  loaderProps?: Record<string, any>

  /**
   * Controls width and height of the button. Numbers are converted to rem.
   *
   * @default 'md'
   */
  size?: MantineSize | `input-${MantineSize}` | (string & {}) | number

  /**
   * Key of `theme.colors` or any valid CSS color.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius. Numbers are converted to rem.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Gradient values used with `variant="gradient"`.
   *
   * @default theme.defaultGradient
   */
  gradient?: MantineGradient

  /**
   * Sets `disabled` attribute, prevents interactions
   *
   * @default false
   */
  disabled?: boolean

  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean

  /** Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API. */
  variant?: ActionIconVariant

  /**
   * Static selector used to build the component classes. Internal prop, not part of the public API.
   *
   * @internal
   */
  __staticSelector?: string
}

export interface ActionIconProps
  extends Omit<BoxProps, keyof ActionIconOwnProps>, ActionIconOwnProps {}

export interface ActionIconSlots {
  default?: () => VNodeChild
}
export type ActionIconStylesNames = 'root' | 'loader' | 'icon'
export type ActionIconCssVariables = {
  root:
    | '--ai-radius'
    | '--ai-size'
    | '--ai-bg'
    | '--ai-hover'
    | '--ai-hover-color'
    | '--ai-color'
    | '--ai-bd'
}

/** Public contract of `ActionIcon`. `component` and `rootRef` come from the factory. */
export type ActionIconFactory = PolymorphicFactory<{
  props: Omit<ActionIconProps, 'component' | 'rootRef'>
  slots: ActionIconSlots
  ref: HTMLButtonElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'button'
  defaultRef: HTMLButtonElement
  stylesNames: ActionIconStylesNames
  vars: ActionIconCssVariables
  variant: ActionIconVariant
  staticComponents: {
    Group: typeof ActionIconGroup
    GroupSection: typeof ActionIconGroupSection
  }
}>
