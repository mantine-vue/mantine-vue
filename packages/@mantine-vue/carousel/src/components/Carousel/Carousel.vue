<script lang="ts">
import { createVarsResolver, getSpacing, rem } from '@mantine-vue/core'
const varsResolver = createVarsResolver<any>((_, { height, controlSize, controlsOffset }) => ({
  root: {
    '--carousel-height': rem(height),
    '--carousel-control-size': rem(controlSize),
    '--carousel-controls-offset': getSpacing(controlsOffset),
  },
}))
export { varsResolver }
</script>

<script setup lang="ts">
import { Comment, computed, ref, useAttrs, useSlots, watch, type VNode } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType } from 'embla-carousel'
import {
  AccordionChevron,
  Box,
  UnstyledButton,
  VisuallyHidden,
  useDirection,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useId } from '@mantine-vue/hooks'
import { provideCarouselContext } from '../../Carousel.context'
import CarouselContainerVariables from '../CarouselVariables/CarouselContainerVariables.vue'
import CarouselVariables from '../CarouselVariables/CarouselVariables.vue'
import { getChevronRotation } from '../../get-chevron-rotation'
import {
  clamp,
  getNextIndicatorIndex,
  getPreviousIndicatorIndex,
} from '../../get-indicator-navigation'
import type { CarouselEmits, CarouselProps } from './Carousel.types'
import classes from '../../Carousel.module.css'

defineOptions({ name: 'Carousel', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CarouselProps>(), {
  controlSize: 26,
  controlsOffset: 'sm',
  slideSize: '100%',
  slideGap: 0,
  orientation: 'horizontal',
  includeGapInSize: true,
  initialSlide: 0,
  withControls: true,
  withIndicators: false,
  withKeyboardEvents: true,
  type: 'media',
})
const props = useProps('Carousel', null, rawProps)
const emit = defineEmits<CarouselEmits>()
const attrs = useAttrs()
const slots = useSlots()
const getStyles = useStyles({
  name: 'Carousel',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  unstyled: props.unstyled,
  vars: props.vars,
  varsResolver,
})
const id = useId(props.id)
const responsiveClassName = `__mantine-vue-carousel-${Math.random().toString(36).slice(2, 9)}`
const { dir } = useDirection()
const defaultEmblaOptions: EmblaOptionsType = {
  align: 'center',
  loop: false,
  slidesToScroll: 1,
  dragFree: false,
  inViewThreshold: 0,
  skipSnaps: false,
  containScroll: 'trimSnaps',
}
const emblaOptions = computed<EmblaOptionsType>(() => ({
  axis: props.orientation === 'horizontal' ? 'x' : 'y',
  direction: props.orientation === 'horizontal' ? dir.value : undefined,
  startIndex: props.initialSlide,
  ...defaultEmblaOptions,
  ...props.emblaOptions,
}))
const plugins = computed(() => props.plugins ?? [])
const [emblaNode, embla] = emblaCarouselVue(emblaOptions, plugins)
const selected = ref(0)
const slidesCount = ref(0)
const slotSlideCount = ref(0)
const canScrollPrev = computed(() => (selected.value >= 0 && embla.value?.canScrollPrev()) || false)
const canScrollNext = computed(() => (selected.value >= 0 && embla.value?.canScrollNext()) || false)
const variablesProps = computed(() => ({
  selector: `.${responsiveClassName}`,
  slideSize: props.slideSize,
  slideGap: props.slideGap,
}))

function countRealSlides(nodes: VNode[]) {
  return nodes.filter((node) => node.type !== Comment).length
}
function renderSlides() {
  const nodes = slots.default?.() ?? []
  slotSlideCount.value = countRealSlides(nodes)
  return nodes
}
function scrollTo(index: number) {
  embla.value?.scrollTo(index)
}
function select() {
  const instance = embla.value
  if (!instance) return
  const slide = instance.selectedScrollSnap()
  const changed = slide !== selected.value
  selected.value = slide
  if (changed) emit('slide-change', slide)
}
function previous() {
  embla.value?.scrollPrev()
  emit('previous-slide')
}
function next() {
  embla.value?.scrollNext()
  emit('next-slide')
}
function keydown(event: KeyboardEvent) {
  if (!props.withKeyboardEvents) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previous()
  }
  if (event.key === 'Home') {
    event.preventDefault()
    scrollTo(0)
  }
  if (event.key === 'End') {
    event.preventDefault()
    scrollTo((embla.value?.scrollSnapList().length ?? 1) - 1)
  }
}
function indicatorKeydown(event: KeyboardEvent, index: number) {
  const nextKey = props.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const previousKey = props.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const parent = (event.currentTarget as HTMLElement).parentElement
  let target: number | null = null
  if (event.key === nextKey) target = getNextIndicatorIndex(index, slidesCount.value)
  if (event.key === previousKey) target = getPreviousIndicatorIndex(index, slidesCount.value)
  if (event.key === 'Home') target = 0
  if (event.key === 'End') target = slidesCount.value - 1
  if (target !== null) {
    event.preventDefault()
    scrollTo(target)
    ;(parent?.children[target] as HTMLElement | undefined)?.focus()
  }
}
function indicatorAttrs(index: number) {
  return {
    ...getStyles('indicator'),
    role: 'tab',
    'aria-label': `Go to slide ${index + 1}`,
    'aria-selected': index === selected.value,
    tabindex: index === selected.value ? 0 : -1,
    'data-active': index === selected.value || undefined,
    'data-orientation': props.orientation,
    onClick: () => scrollTo(index),
    onKeydown: (event: KeyboardEvent) => indicatorKeydown(event, index),
    onMousedown: (event: Event) => event.preventDefault(),
    ...props.getIndicatorProps?.(index),
  }
}
function previousAttrs() {
  return {
    'aria-controls': id.value,
    'aria-label': 'Previous slide',
    'aria-disabled': !canScrollPrev.value,
    'data-inactive': !canScrollPrev.value || undefined,
    'data-type': 'previous',
    tabindex: canScrollPrev.value ? 0 : -1,
    ...props.previousControlProps,
    ...getStyles('control', {
      className: props.previousControlProps?.className,
      style: props.previousControlProps?.style,
    }),
    onClick: (event: Event) => {
      previous()
      props.previousControlProps?.onClick?.(event)
    },
  }
}
function nextAttrs() {
  return {
    'aria-controls': id.value,
    'aria-label': 'Next slide',
    'aria-disabled': !canScrollNext.value,
    'data-inactive': !canScrollNext.value || undefined,
    'data-type': 'next',
    tabindex: canScrollNext.value ? 0 : -1,
    ...getStyles('control', {
      className: props.nextControlProps?.className,
      style: props.nextControlProps?.style,
    }),
    ...props.nextControlProps,
    onClick: (event: Event) => {
      next()
      props.nextControlProps?.onClick?.(event)
    },
  }
}
const renderPreviousIcon = () => props.previousControlIcon
const renderNextIcon = () => props.nextControlIcon

watch(
  embla,
  (instance, _previous, onCleanup) => {
    if (!instance) return
    emit('embla-api-ready', instance)
    select()
    slidesCount.value = instance.scrollSnapList().length
    instance.on('select', select)
    onCleanup(() => instance.off('select', select))
  },
  { immediate: true },
)
watch([slotSlideCount, () => props.emblaOptions?.slidesToScroll], ([childrenCount]) => {
  const instance = embla.value
  if (!instance) return
  instance.reInit()
  slidesCount.value = instance.scrollSnapList().length
  selected.value = clamp(selected.value, 0, childrenCount - 1)
})
provideCarouselContext({
  getStyles,
  get orientation() {
    return props.orientation
  },
} as any)

defineExpose({ embla })
</script>

<template>
  <CarouselContainerVariables v-if="props.type === 'container'" v-bind="variablesProps" />
  <CarouselVariables v-else v-bind="variablesProps" />
  <Box
    v-bind="{
      role: 'region',
      'aria-roledescription': 'carousel',
      ...attrs,
      ...getStyles('root', { className: responsiveClassName }),
    }"
    :id="id"
    :mod="[
      { orientation: props.orientation, 'include-gap-in-size': props.includeGapInSize },
      props.mod,
    ]"
    @keydown.capture="keydown"
  >
    <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
      {{ slidesCount > 0 ? `Slide ${selected + 1} of ${slidesCount}` : '' }}
    </VisuallyHidden>
    <div
      v-if="props.withControls"
      v-bind="getStyles('controls')"
      :data-orientation="props.orientation"
    >
      <UnstyledButton v-bind="previousAttrs()">
        <component v-if="props.previousControlIcon !== undefined" :is="renderPreviousIcon" />
        <AccordionChevron
          v-else
          :style="{
            transform: `rotate(${getChevronRotation({ dir, orientation: props.orientation, direction: 'previous' })}deg)`,
          }"
        />
      </UnstyledButton>
      <UnstyledButton v-bind="nextAttrs()">
        <component v-if="props.nextControlIcon !== undefined" :is="renderNextIcon" />
        <AccordionChevron
          v-else
          :style="{
            transform: `rotate(${getChevronRotation({ dir, orientation: props.orientation, direction: 'next' })}deg)`,
          }"
        />
      </UnstyledButton>
    </div>
    <div ref="emblaNode" v-bind="getStyles('viewport')" :data-type="props.type">
      <div
        v-bind="getStyles('container', { className: responsiveClassName })"
        :data-orientation="props.orientation"
      >
        <component :is="renderSlides" />
      </div>
    </div>
    <div
      v-if="props.withIndicators"
      v-bind="getStyles('indicators')"
      role="tablist"
      aria-label="Slides"
      :data-orientation="props.orientation"
    >
      <UnstyledButton
        v-for="index in slidesCount"
        :key="index - 1"
        v-bind="indicatorAttrs(index - 1)"
      />
    </div>
  </Box>
</template>
