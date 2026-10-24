import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineElementType,
  MantineRadius,
  MantineSize,
  PolymorphicFactory,
  StylesApiProps,
} from '../../core'

export type ToggleStylesNames = 'root'
export type ToggleVariant = 'light' | 'filled'
export type ToggleCssVariables = {
  root:
    | '--toggle-size'
    | '--toggle-radius'
    | '--toggle-active-bg'
    | '--toggle-active-hover'
    | '--toggle-active-color'
}

export interface ToggleOwnProps extends StylesApiProps<ToggleFactory> {
  /** Root element or Vue component rendered by the component. @default 'button' */
  component?: MantineElementType
  /** Controlled active state */
  active?: boolean
  /** Uncontrolled default active state */
  defaultActive?: boolean
  /** If set, the toggle is disabled */
  disabled?: boolean
  /** Controls toggle height and min-width, `'md'` by default */
  size?: MantineSize | (string & {})
  /** Key of `theme.radius` or any valid CSS value to set `border-radius`, `theme.defaultRadius` by default */
  radius?: MantineRadius
  /** If set, the toggle width adjusts to content instead of being square, `false` by default */
  autoWidth?: boolean
  /** Key of `theme.colors` or any valid CSS color, `theme.primaryColor` by default */
  color?: MantineColor
  /** Determines whether icon color with filled variant should be changed based on the given `color` prop */
  autoContrast?: boolean
  /** Controls visual representation of the component. @default 'filled' */
  variant?: ToggleVariant
}
export interface ToggleProps extends Omit<BoxProps, keyof ToggleOwnProps>, ToggleOwnProps {}
export interface ToggleSlots {
  default?: () => VNodeChild
}
export interface ToggleEmits {
  'update:active': [active: boolean]
  activeChange: [active: boolean]
}
export type ToggleFactory = PolymorphicFactory<{
  props: Omit<ToggleProps, 'component'>
  slots: ToggleSlots
  emits: ToggleEmits
  ref: HTMLButtonElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'button'
  defaultRef: HTMLButtonElement
  stylesNames: ToggleStylesNames
  vars: ToggleCssVariables
  variant: ToggleVariant
}>
