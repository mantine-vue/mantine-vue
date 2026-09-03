import type { VNodeChild } from 'vue'
import type { BoxProps } from '@mantine-vue/core'
import type { LightboxSlideData } from '../types'
export type LightboxSlideStylesNames = 'slide' | 'slideImage' | 'slideVideo'
export interface LightboxSlideProps extends /* @vue-ignore */ BoxProps {
  /** Slide data rendered by the component */
  slide: LightboxSlideData
  /** Zero-based slide index */
  index: number
}
export interface LightboxSlideSlots {
  default?: (props: { slide: LightboxSlideData; active: boolean }) => VNodeChild
}
