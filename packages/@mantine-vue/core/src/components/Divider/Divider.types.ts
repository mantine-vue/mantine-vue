import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineNode,
  MantineSize,
  StylesApiProps,
  Factory,
} from '../../core'

export type DividerVariant = 'solid' | 'dashed' | 'dotted'

/** Props declared by `Divider` itself. See `DividerProps` for the full public type. */
export interface DividerOwnProps extends StylesApiProps<DividerFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Key of `theme.colors` or any valid CSS color value */
  color?: MantineColor

  /**
   * Controls width/height (depends on orientation)
   *
   * @default 'xs'
   */
  size?: MantineSize | number | (string & {})

  /** Divider label, visible only with `orientation="horizontal"` */
  label?: MantineNode

  /**
   * Label position
   *
   * @default 'center'
   */
  labelPosition?: 'left' | 'center' | 'right'

  /**
   * Divider orientation
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'solid'
   */
  variant?: DividerVariant
}

export interface DividerSlots {
  /** Label fallback, used when the `label` prop and named slot are not set. */
  default?: () => VNodeChild
  /** Divider label. Used when the `label` prop is not set. */
  label?: () => VNodeChild
}

export interface DividerProps extends Omit<BoxProps, keyof DividerOwnProps>, DividerOwnProps {}

export type DividerStylesNames = 'root' | 'label'

export type DividerCssVariables = {
  root: '--divider-color' | '--divider-border-style' | '--divider-size'
}

export type DividerFactory = Factory<{
  props: Omit<DividerProps, 'rootRef'>
  ref: HTMLSpanElement
  slots: DividerSlots
  element: 'span'
  stylesNames: DividerStylesNames
  vars: DividerCssVariables
  variant: DividerVariant
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
