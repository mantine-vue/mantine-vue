import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../../core'

export interface SliderRootSlots {
  /** Track, marks and thumbs. */
  default?: () => VNodeChild
}

/** Props declared by `SliderRoot` itself. See `SliderRootProps` for the full public type. */
export interface SliderRootOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Controls the size of the track. Passed through to the Styles API payload. */
  size: string | number

  /**
   * If set, the slider cannot be interacted with.
   *
   * @default false
   */
  disabled?: boolean

  /** Controls the visual representation of the slider. */
  variant?: string

  /**
   * Direction the slider is laid out in.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface SliderRootProps
  extends Omit<BoxProps, keyof SliderRootOwnProps>, SliderRootOwnProps {}

export type SliderRootStylesNames = 'root'

export type SliderRootFactory = Factory<{
  props: Omit<SliderRootProps, 'rootRef'>
  ref: HTMLDivElement
  slots: SliderRootSlots
  element: 'div'
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
