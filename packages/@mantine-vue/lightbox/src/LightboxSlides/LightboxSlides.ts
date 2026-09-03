import type { VNodeChild } from 'vue'
import type { BoxProps } from '@mantine-vue/core'
import LightboxSlides from './LightboxSlides.vue'
export { LightboxSlides }
export type LightboxSlidesStylesNames = 'slides' | 'slidesViewport' | 'slidesContainer'
export type LightboxSlidesProps = BoxProps
export interface LightboxSlidesSlots {
  default?: () => VNodeChild
}
