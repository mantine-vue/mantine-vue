<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import { assignRef, useId } from '@mantine-vue/hooks'
import { Box, useDirection, useStyles } from '../../core'
import { OptionalPortal } from '../Portal'
import { defaultTourLabels, provideTourContext } from './Tour.context'
import { varsResolver } from './Tour.vue'
import type { TourEmits, TourRootProps } from './Tour.types'
import classes from './Tour.module.css'
defineOptions({ name: 'TourRoot', inheritAttrs: false })
const props = withDefaults(defineProps<TourRootProps>(), {
  active: false,
  defaultStep: 0,
  withOverlay: true,
  withOverlayInteraction: false,
  withCloseButton: true,
  withKeyboardNavigation: true,
  spotlightPadding: 8,
  spotlightRadius: 4,
  closeOnEscape: true,
  closeOnOverlayClick: false,
  withinPortal: true,
  zIndex: 10000,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  unstyled: false,
})
const emit = defineEmits<TourEmits>()
const attrs = useAttrs()
const { dir } = useDirection()
const internal = ref(props.defaultStep)
const rootElement = ref<Element | null>(null)
const id = useId()
const titleMounted = ref(false)
const bodyMounted = ref(false)
const targetElement = ref<HTMLElement | null>(null)
const step = computed(() => (props.step === undefined ? internal.value : props.step))
const labels = computed(() => ({ ...defaultTourLabels, ...props.labels }))
const getStyles = useStyles({
  name: 'Tour',
  classes,
  props: props as any,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})
function setStep(value: number) {
  if (props.step === undefined) internal.value = value
  emit('update:step', value)
  emit('stepChange', value)
}
function close() {
  emit('close')
}
function onKeydown(event: KeyboardEvent) {
  if (!props.active || event.isComposing) return
  if (event.key === 'Escape' && props.closeOnEscape) {
    close()
    return
  }
  if (!props.withKeyboardNavigation || targetElement.value?.contains(event.target as Node)) return
  const next = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  const back = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
  if (event.key === next) {
    event.preventDefault()
    if (step.value < props.stepsCount - 1) setStep(step.value + 1)
    else close()
  } else if (event.key === back && step.value > 0) {
    event.preventDefault()
    setStep(step.value - 1)
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown, true))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, true))
provideTourContext({
  getStyles,
  get step() {
    return step.value
  },
  setStep,
  stepsCount: props.stepsCount,
  close,
  withOverlay: props.withOverlay,
  withOverlayInteraction: props.withOverlayInteraction,
  withCloseButton: props.withCloseButton,
  closeOnOverlayClick: props.closeOnOverlayClick,
  spotlightPadding: props.spotlightPadding,
  spotlightRadius: props.spotlightRadius,
  color: props.color,
  get labels() {
    return labels.value
  },
  get titleId() {
    return `${id.value}-title`
  },
  get bodyId() {
    return `${id.value}-body`
  },
  get titleMounted() {
    return titleMounted.value
  },
  get bodyMounted() {
    return bodyMounted.value
  },
  registerTitle: (value) => (titleMounted.value = value !== null),
  registerBody: (value) => (bodyMounted.value = value !== null),
  get targetElement() {
    return targetElement.value
  },
  setTargetElement: (element) => (targetElement.value = element),
})
function setRootRef(node: any) {
  rootElement.value = node?.$el ?? node ?? null
  assignRef(props.rootRef, rootElement.value)
}
</script>
<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal"
    ><Box
      v-if="props.active"
      :root-ref="setRootRef"
      v-bind="{ ...attrs, ...getStyles('root', { className: attrs.class, style: attrs.style }) }"
      ><slot /></Box
  ></OptionalPortal>
</template>
