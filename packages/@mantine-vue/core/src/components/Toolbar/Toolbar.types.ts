import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  Factory,
  MantineColor,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'
import type { ToggleVariant } from '../Toggle'
import type ToolbarDivider from './ToolbarDivider.vue'
import type ToolbarGroup from './ToolbarGroup.vue'
import type ToolbarToggle from './ToolbarToggle.vue'
import type ToolbarToggleGroup from './ToolbarToggleGroup.vue'
import type ToolbarToggleItem from './ToolbarToggleItem.vue'

export type ToolbarStylesNames = 'root' | 'group' | 'toggle' | 'divider'
export type ToolbarCssVariables = {
  root: '--toolbar-toggle-size' | '--toolbar-padding' | '--toolbar-gap' | '--toolbar-radius'
  toggle:
    | '--toolbar-toggle-active-bg'
    | '--toolbar-toggle-active-hover'
    | '--toolbar-toggle-active-color'
}
export interface ToolbarOwnProps extends StylesApiProps<ToolbarFactory> {
  /** Toolbar orientation, `'horizontal'` by default */
  orientation?: 'horizontal' | 'vertical'
  /** Whether arrow key navigation wraps from last to first item, `true` by default */
  loop?: boolean
  /** Controls size of toggle components, padding, and gap, `'md'` by default */
  size?: MantineSize | (string & {})
  /** Key of `theme.radius` or any valid CSS value to set `border-radius`, propagated to all children, `theme.defaultRadius` by default */
  radius?: MantineRadius
  /** Determines whether the toolbar has a border, `true` by default */
  withBorder?: boolean
  /** Key of `theme.colors` or any valid CSS color, controls color of child toggle components */
  color?: MantineColor
  /** Determines whether icon color with filled variant should be changed based on the given `color` prop */
  autoContrast?: boolean
  /** Controls visual representation of child toggle components. @default 'filled' */
  variant?: ToggleVariant
}
export interface ToolbarProps extends Omit<BoxProps, keyof ToolbarOwnProps>, ToolbarOwnProps {}
export interface ToolbarSlots {
  default?: () => VNodeChild
}
export type ToolbarFactory = Factory<{
  props: ToolbarProps
  slots: ToolbarSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: ToolbarStylesNames
  vars: ToolbarCssVariables
  variant: ToggleVariant
  staticComponents: {
    Group: typeof ToolbarGroup
    Toggle: typeof ToolbarToggle
    ToggleGroup: typeof ToolbarToggleGroup
    ToggleItem: typeof ToolbarToggleItem
    Divider: typeof ToolbarDivider
  }
}>

export interface ToolbarCompoundProps extends BoxProps {
  classNames?: any
  styles?: any
}
export type ToolbarGroupProps = ToolbarCompoundProps
export type ToolbarDividerProps = ToolbarCompoundProps
export interface ToolbarToggleProps extends ToolbarCompoundProps {
  disabled?: boolean
  active?: boolean
  autoWidth?: boolean
  component?: any
}
interface ToolbarToggleGroupBaseProps extends ToolbarCompoundProps {
  disabled?: boolean
}
export interface ToolbarToggleGroupSingleProps extends ToolbarToggleGroupBaseProps {
  type: 'single'
  modelValue?: string | null
  defaultValue?: string | null
}
export interface ToolbarToggleGroupMultipleProps extends ToolbarToggleGroupBaseProps {
  type: 'multiple'
  modelValue?: string[]
  defaultValue?: string[]
}
export type ToolbarToggleGroupProps =
  | ToolbarToggleGroupSingleProps
  | ToolbarToggleGroupMultipleProps
export interface ToolbarToggleItemProps extends ToolbarCompoundProps {
  value: string
  disabled?: boolean
  autoWidth?: boolean
}
