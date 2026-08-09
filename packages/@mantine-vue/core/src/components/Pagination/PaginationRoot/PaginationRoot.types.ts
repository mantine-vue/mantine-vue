import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../../core'

export type PaginationRootStylesNames = 'root' | 'control' | 'dots' | 'items' | 'label'

export type PaginationLayout = 'default' | 'responsive'

export type PaginationRootCssVariables = {
  root: '--pagination-control-radius' | '--pagination-control-size' | '--pagination-control-fz'
}

export interface PaginationRootSlots {
  /** Pagination controls, usually built from the `Pagination.*` compound members. */
  default?: () => VNodeChild
}

/**
 * Props declared by `PaginationRoot` itself.
 * See `PaginationRootProps` for the full public type.
 */
export interface PaginationRootOwnProps extends StylesApiProps<PaginationRootProps> {
  /** Total number of pages. */
  total: number

  /** Active page, bound with `v-model`. */
  modelValue?: number

  /** Uncontrolled initial active page. */
  defaultValue?: number

  /**
   * Number of page controls shown on each side of the active page.
   *
   * @default 1
   */
  siblings?: number

  /**
   * Number of page controls shown at each end of the range.
   *
   * @default 1
   */
  boundaries?: number

  /**
   * Key of `theme.colors` or any valid CSS color of the active control.
   *
   * @default 'var(--mantine-primary-color-filled)'
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Controls the size of the controls.
   *
   * @default 'md'
   */
  size?: MantineSize | `input-${MantineSize}` | (string & {}) | number

  /**
   * If set, every control is disabled.
   *
   * @default false
   */
  disabled?: boolean

  /** If set, adjusts text color based on background color for the active control. */
  autoContrast?: boolean

  /** Returns extra props for the control of a given page. */
  getItemProps?: (page: number) => Record<string, any>

  /**
   * Controls how the page controls are laid out.
   *
   * @default 'default'
   */
  layout?: PaginationLayout

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface PaginationRootProps
  extends Omit<BoxProps, keyof PaginationRootOwnProps>, PaginationRootOwnProps {}
