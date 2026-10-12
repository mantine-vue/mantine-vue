import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
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
  rootRef?: VueRefTarget<Element>
  component?: MantineElementType
  active?: boolean
  defaultActive?: boolean
  disabled?: boolean
  size?: MantineSize | (string & {})
  radius?: MantineRadius
  autoWidth?: boolean
  color?: MantineColor
  autoContrast?: boolean
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
  props: Omit<ToggleProps, 'component' | 'rootRef'>
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
