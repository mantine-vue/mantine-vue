import type { ProgressRootCssVariables } from './ProgressRoot/ProgressRoot.types'
import type { ProgressLabel } from './ProgressLabel/ProgressLabel'
import type { ProgressSection } from './ProgressSection/ProgressSection'
import type { ProgressRoot } from './ProgressRoot/ProgressRoot'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type {
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  StylesApiProps,
  Factory,
} from '../../core'

export type ProgressStylesNames = 'root' | 'section' | 'label'

/** Props declared by `Progress` itself. See `ProgressProps` for the full public type. */
export interface ProgressOwnProps extends StylesApiProps<ProgressFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Value of the progress */
  value: number

  /**
   * Key of `theme.colors` or any valid CSS value
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * If set, the section has stripes
   *
   * @default false
   */
  striped?: boolean

  /**
   * If set, the sections stripes are animated (automatically enables striped)
   *
   * @default false
   */
  animated?: boolean

  /**
   * Controls track height
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** If set, adjusts label text color based on section background color for readability */
  autoContrast?: boolean

  /**
   * Controls sections width transition duration, value is specified in ms
   *
   * @default 100
   */
  transitionDuration?: number

  /**
   * Controls orientation
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface ProgressProps extends Omit<BoxProps, keyof ProgressOwnProps>, ProgressOwnProps {}

export type ProgressFactory = Factory<{
  props: Omit<ProgressProps, 'rootRef'>
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: ProgressStylesNames
  // `Progress` renders through `ProgressRoot`, whose resolver owns these -- as upstream does.
  vars: ProgressRootCssVariables
  staticComponents: {
    Root: typeof ProgressRoot
    Section: typeof ProgressSection
    Label: typeof ProgressLabel
  }
}>
