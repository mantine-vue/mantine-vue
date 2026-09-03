<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import type { EmblaOptionsType } from 'embla-carousel'
import { LightboxCaption } from './LightboxCaption'
import { LightboxNavigation } from './LightboxNavigation'
import { LightboxRoot } from './LightboxRoot'
import { LightboxSlide } from './LightboxSlide'
import { LightboxSlides } from './LightboxSlides'
import { LightboxThumbnails } from './LightboxThumbnails'
import { LightboxToolbar } from './LightboxToolbar'
import type { LightboxSlots } from './Lightbox.props'
import type { LightboxLabels, LightboxSlideData, ToolbarItems } from './types'
defineOptions({ name: 'Lightbox', inheritAttrs: false })
interface RuntimeLightboxProps {
  opened: boolean
  slides: LightboxSlideData[]
  currentIndex?: number
  labels?: Partial<LightboxLabels>
  withZoom?: boolean
  withThumbnails?: boolean
  withFullscreen?: boolean
  withDownload?: boolean
  loop?: boolean
  closeOnClickOutside?: boolean
  closeOnSwipeDown?: boolean
  withKeyboardEvents?: boolean
  returnFocus?: boolean
  withInitialFocusPlaceholder?: boolean
  withinPortal?: boolean
  zIndex?: string | number
  transitionDuration?: number
  transitionProps?: Record<string, unknown>
  emblaOptions?: EmblaOptionsType
  zoomMaxScale?: number
  withSlideTransition?: boolean
  toolbarItems?: ToolbarItems
  withNavigation?: boolean
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
}
const props = withDefaults(defineProps<RuntimeLightboxProps>(), {
  withZoom: undefined,
  withThumbnails: undefined,
  withFullscreen: undefined,
  withDownload: undefined,
  loop: undefined,
  closeOnClickOutside: undefined,
  closeOnSwipeDown: undefined,
  withKeyboardEvents: undefined,
  returnFocus: undefined,
  withInitialFocusPlaceholder: undefined,
  withinPortal: undefined,
  withSlideTransition: undefined,
  withNavigation: true,
  unstyled: undefined,
})
const emit = defineEmits<{
  close: []
  'update:opened': [opened: boolean]
  indexChange: [index: number]
  'update:currentIndex': [index: number]
}>()
defineSlots<LightboxSlots>()
const slots = useSlots()
const attrs = useAttrs()
</script>
<template>
  <LightboxRoot
    v-bind="{ ...attrs, ...props }"
    @close="emit('close')"
    @update:opened="emit('update:opened', $event)"
    @index-change="emit('indexChange', $event)"
    @update:current-index="emit('update:currentIndex', $event)"
    ><slot
      ><LightboxToolbar :toolbar-items="props.toolbarItems" /><LightboxSlides
        ><LightboxSlide
          v-for="(slide, index) in props.slides"
          :key="index"
          :slide="slide"
          :index="index"
          ><template v-if="slots.slide" #default="payload"
            ><slot
              name="slide"
              v-bind="{ ...payload, index }" /></template></LightboxSlide></LightboxSlides
      ><LightboxNavigation
        v-if="props.withNavigation" /><LightboxCaption /><LightboxThumbnails /></slot
  ></LightboxRoot>
</template>
