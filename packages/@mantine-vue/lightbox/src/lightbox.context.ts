import { createSafeContext } from '@mantine-vue/core'
import type { EmblaOptionsType } from 'embla-carousel'
import type { LightboxLabels, ToolbarItemsPayload } from './types'

export interface LightboxContextValue extends ToolbarItemsPayload {
  getStyles: (selector: string, options?: Record<string, any>) => Record<string, any>
  opened: boolean
  withZoom: boolean
  withThumbnails: boolean
  withFullscreen: boolean
  withDownload: boolean
  loop: boolean
  closeOnSwipeDown: boolean
  closeOnClickOutside: boolean
  withSlideTransition: boolean
  transitionDuration: number
  emblaOptions?: EmblaOptionsType
  labels: LightboxLabels
  zoomScale: number
  panZoom: (deltaX: number, deltaY: number) => boolean
  getImageZoomProps: () => Record<string, any>
}

export const [provideLightboxContext, useLightboxContext] = createSafeContext<LightboxContextValue>(
  'Lightbox component was not found in tree',
)
