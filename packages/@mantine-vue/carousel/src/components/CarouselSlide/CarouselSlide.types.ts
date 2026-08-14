import type { Factory } from '@mantine-vue/core'
import type { VueRefTarget } from '@mantine-vue/hooks'
export type CarouselSlideStylesNames = 'slide'
/** Props accepted by `CarouselSlide`. */
export interface CarouselSlideProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  classNames?: any
  styles?: any
  mod?: any
}

export type CarouselSlideFactory = Factory<{
  props: Omit<CarouselSlideProps, 'rootRef'>
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: CarouselSlideStylesNames
}>
