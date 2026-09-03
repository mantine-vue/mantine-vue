<script lang="ts">
export const lightboxRootDefaultProps = {
  withZoom: false,
  withThumbnails: false,
  withFullscreen: false,
  withDownload: false,
  loop: false,
  closeOnClickOutside: false,
  closeOnSwipeDown: true,
  withKeyboardEvents: true,
  returnFocus: true,
  withInitialFocusPlaceholder: true,
  withinPortal: true,
  transitionDuration: 200,
  zoomMaxScale: 3,
  withSlideTransition: false,
} as const
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import {
  Box,
  FocusTrap,
  Transition as MantineTransition,
  VisuallyHidden,
  useDirection,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { DEFAULT_LABELS } from '../default-labels'
import { provideLightboxContext } from '../lightbox.context'
import type {
  LightboxRootEmits,
  LightboxRootOwnProps,
  LightboxRootSlots,
} from './LightboxRoot.types'
import { useLightboxZoom } from '../hooks/use-lightbox-zoom'
import classes from '../Lightbox.module.css'

defineOptions({ name: 'LightboxRoot', inheritAttrs: false })
const rawProps = withDefaults(defineProps<LightboxRootOwnProps>(), {
  currentIndex: undefined,
  labels: undefined,
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
  zIndex: undefined,
  transitionDuration: undefined,
  transitionProps: undefined,
  emblaOptions: undefined,
  zoomMaxScale: undefined,
  withSlideTransition: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})
defineSlots<LightboxRootSlots>()
const emit = defineEmits<LightboxRootEmits>()
const props = useProps('LightboxRoot', lightboxRootDefaultProps, rawProps)
const attrs = useAttrs()
const contentRef = ref<HTMLElement | null>(null)
const internalIndex = ref(props.currentIndex ?? 0)
const thumbnailsVisible = ref(Boolean(props.withThumbnails))
const isFullscreen = ref(false)
const ownsFullscreen = ref(false)
const { dir } = useDirection()
let previousActive: HTMLElement | null = null
let previousOverflow = ''

const labels = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }))
const currentIndex = computed(() => props.currentIndex ?? internalIndex.value)
const currentSlideLabel = computed(() => {
  const slide = props.slides[currentIndex.value]
  if (!slide || slide.type === 'custom') return undefined
  return slide.type === 'video' ? slide.label : slide.alt
})
const zoom = useLightboxZoom({
  enabled: () => props.withZoom!,
  maxScale: () => props.zoomMaxScale!,
  currentIndex: () => currentIndex.value,
})
const getStyles = useStyles({
  name: 'Lightbox',
  props,
  classes,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
})
const rootStyle = computed(() => ({
  '--lightbox-transition-duration': `${props.transitionDuration}ms`,
  '--lightbox-z-index': props.zIndex == null ? undefined : String(props.zIndex),
}))
const contentTransition = computed(() => ({
  transition: {
    common: { transformOrigin: 'center center' },
    in: { opacity: 1, transform: 'scale(1)' },
    out: { opacity: 0, transform: 'scale(0.95)' },
    transitionProperty: 'transform, opacity',
  },
  duration: props.transitionDuration,
  timingFunction: 'ease',
  ...props.transitionProps,
}))
const overlayTransition = computed(() => ({
  transition: 'fade' as const,
  duration: contentTransition.value.duration,
  exitDuration: contentTransition.value.exitDuration,
  timingFunction: contentTransition.value.timingFunction,
  enterDelay: contentTransition.value.enterDelay,
  exitDelay: contentTransition.value.exitDelay,
  keepMounted: contentTransition.value.keepMounted,
}))
const setIndex = (index: number) => {
  const next = Math.max(0, Math.min(Math.round(index), Math.max(0, props.slides.length - 1)))
  if (next === currentIndex.value) return
  internalIndex.value = next
  emit('update:currentIndex', next)
  emit('indexChange', next)
}
const next = () =>
  setIndex(
    currentIndex.value + 1 < props.slides.length
      ? currentIndex.value + 1
      : props.loop && props.slides.length
        ? 0
        : currentIndex.value,
  )
const prev = () =>
  setIndex(
    currentIndex.value > 0
      ? currentIndex.value - 1
      : props.loop && props.slides.length
        ? props.slides.length - 1
        : 0,
  )
const close = () => {
  emit('update:opened', false)
  emit('close')
}
const toggleThumbnails = () => {
  thumbnailsVisible.value = !thumbnailsVisible.value
}
const toggleFullscreen = async () => {
  if (!props.withFullscreen || typeof document === 'undefined') return
  if (document.fullscreenElement) {
    ownsFullscreen.value = false
    await document.exitFullscreen?.()
  } else {
    await contentRef.value?.requestFullscreen?.()
    ownsFullscreen.value = document.fullscreenElement === contentRef.value
  }
  isFullscreen.value = Boolean(document.fullscreenElement)
}
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.opened) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (
    !props.withKeyboardEvents ||
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  )
    return

  if (event.target instanceof Element) {
    if (event.target.closest('input, textarea, select, video, audio, [contenteditable]')) return
    if (
      event.target.closest('[data-lightbox-slide]') &&
      event.target.closest(
        'button, a[href], [role="button"], [role="link"], [role="slider"], [role="textbox"], [role="combobox"], [role="listbox"], [role="menu"], [role="tablist"], [role="tree"], [role="grid"]',
      )
    )
      return
  }

  const leading = dir.value === 'rtl' ? next : prev
  const trailing = dir.value === 'rtl' ? prev : next
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (!zoom.panZoom(50, 0)) leading()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (!zoom.panZoom(-50, 0)) trailing()
  }
  if (event.key === 'ArrowUp' && zoom.panZoom(0, 50)) event.preventDefault()
  if (event.key === 'ArrowDown' && zoom.panZoom(0, -50)) event.preventDefault()
  if (event.key.toLowerCase() === 'f' && props.withFullscreen) {
    event.preventDefault()
    toggleFullscreen()
  }
  if (event.key.toLowerCase() === 't' && props.withThumbnails) {
    event.preventDefault()
    toggleThumbnails()
  }
  if (event.key.toLowerCase() === 'z' && props.withZoom) {
    event.preventDefault()
    zoom.toggleZoom()
  }
}
const handleFullscreen = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
  if (!document.fullscreenElement) ownsFullscreen.value = false
}

watch(
  () => props.currentIndex,
  (value) => {
    if (value != null) internalIndex.value = value
  },
)
watch(
  () => props.withThumbnails,
  (value) => {
    thumbnailsVisible.value = Boolean(value)
  },
)
watch(
  () => props.slides.length,
  (length) => {
    if (length > 0 && currentIndex.value > length - 1) setIndex(length - 1)
  },
)
watch(
  () => props.opened,
  async (opened) => {
    if (typeof document === 'undefined') return
    if (opened) {
      previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)
      document.addEventListener('fullscreenchange', handleFullscreen)
      await nextTick()
      contentRef.value?.focus({ preventScroll: true })
    } else {
      zoom.resetZoom()
      thumbnailsVisible.value = Boolean(props.withThumbnails)
      if (ownsFullscreen.value && document.fullscreenElement) {
        ownsFullscreen.value = false
        document.exitFullscreen?.().catch(() => {})
      }
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('fullscreenchange', handleFullscreen)
      if (props.returnFocus) previousActive?.focus({ preventScroll: true })
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    if (ownsFullscreen.value && document.fullscreenElement)
      document.exitFullscreen?.().catch(() => {})
    document.body.style.overflow = previousOverflow
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('fullscreenchange', handleFullscreen)
  }
})

provideLightboxContext({
  getStyles,
  get labels() {
    return labels.value
  },
  get opened() {
    return props.opened
  },
  get slides() {
    return props.slides
  },
  get currentIndex() {
    return currentIndex.value
  },
  setIndex,
  next,
  prev,
  close,
  get thumbnailsVisible() {
    return thumbnailsVisible.value
  },
  toggleThumbnails,
  get isFullscreen() {
    return isFullscreen.value
  },
  toggleFullscreen,
  get zoomed() {
    return zoom.zoomState.value.isZoomed
  },
  toggleZoom: zoom.toggleZoom,
  get zoomScale() {
    return zoom.zoomState.value.scale
  },
  panZoom: zoom.panZoom,
  getImageZoomProps: zoom.getImageProps,
  get withZoom() {
    return props.withZoom!
  },
  get withThumbnails() {
    return props.withThumbnails!
  },
  get withFullscreen() {
    return props.withFullscreen!
  },
  get withDownload() {
    return props.withDownload!
  },
  get loop() {
    return props.loop!
  },
  get closeOnSwipeDown() {
    return props.closeOnSwipeDown!
  },
  get closeOnClickOutside() {
    return props.closeOnClickOutside!
  },
  get withSlideTransition() {
    return props.withSlideTransition!
  },
  get transitionDuration() {
    return props.transitionDuration!
  },
  get emblaOptions() {
    return props.emblaOptions
  },
})
</script>

<template>
  <Teleport to="body" :disabled="!props.withinPortal">
    <Box v-bind="getStyles('root')" :style="rootStyle">
      <MantineTransition :mounted="props.opened" v-bind="overlayTransition">
        <template #default="transitionStyles">
          <div
            v-bind="getStyles('overlay', { style: transitionStyles })"
            @click="props.closeOnClickOutside ? close() : undefined"
          />
        </template>
      </MantineTransition>
      <MantineTransition :mounted="props.opened" v-bind="contentTransition">
        <template #default="transitionStyles">
          <FocusTrap :active="props.opened">
            <div
              ref="contentRef"
              v-bind="{ ...attrs, ...getStyles('content', { style: transitionStyles }) }"
              role="dialog"
              aria-modal="true"
              :aria-label="labels.lightboxLabel"
              tabindex="-1"
              @click.self="props.closeOnClickOutside ? close() : undefined"
            >
              <span
                v-if="props.withInitialFocusPlaceholder"
                data-autofocus
                tabindex="0"
                style="position: fixed; width: 1px; height: 1px; overflow: hidden"
              />
              <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
                <template v-if="props.slides.length">
                  {{ labels.slideLabel(currentIndex + 1, props.slides.length)
                  }}<template v-if="currentSlideLabel">: {{ currentSlideLabel }}</template>
                </template>
              </VisuallyHidden>
              <slot />
            </div>
          </FocusTrap>
        </template>
      </MantineTransition>
    </Box>
  </Teleport>
</template>
