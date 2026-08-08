import type {
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  MantineSpacing,
  StylesApiProps,
} from '../../core'
import type { PaginationLayout } from './PaginationRoot/PaginationRoot'

/** Props declared by `Pagination` itself. See `PaginationProps` for the full public type. */
export interface PaginationOwnProps extends StylesApiProps<PaginationProps> {
  /** Total number of pages. Nothing is rendered when it is not positive. */
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
   * If set, the previous and next controls are rendered.
   *
   * @default true
   */
  withControls?: boolean

  /**
   * If set, the first and last controls are rendered.
   *
   * @default false
   */
  withEdges?: boolean

  /**
   * If set, the page number controls are rendered.
   *
   * @default true
   */
  withPages?: boolean

  /**
   * If set, nothing is rendered when there is only one page.
   *
   * @default false
   */
  hideWithOnePage?: boolean

  /**
   * Key of `theme.spacing` or any valid CSS value for the gap between controls.
   *
   * @default 8
   */
  gap?: MantineSpacing

  /**
   * Key of `theme.colors` or any valid CSS color of the active control.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** Controls the size of the controls. */
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

  /** Controls how the page controls are laid out. */
  layout?: PaginationLayout
}

export interface PaginationProps
  extends Omit<BoxProps, keyof PaginationOwnProps>, PaginationOwnProps {}
