<script lang="ts">
import { createVarsResolver } from '../../core'

export const varsResolver = createVarsResolver<any>(
  (theme, { transitionDuration }, { shouldReduceMotion }) => {
    const duration =
      theme.respectReducedMotion && shouldReduceMotion
        ? '0ms'
        : typeof transitionDuration === 'number'
          ? `${transitionDuration}ms`
          : transitionDuration || '150ms'

    return { root: { '--transition-duration': duration } }
  },
)
</script>

<script setup lang="ts">
import { computed, ref, toRef, useAttrs } from 'vue'
import { useReducedMotion } from '@mantine-vue/hooks'
import { Box, useStyles } from '../../core'
import { useFloatingIndicator } from './use-floating-indicator'
import type { FloatingIndicatorOwnProps, FloatingIndicatorSlots } from './FloatingIndicator.types'
import classes from './FloatingIndicator.module.css'

defineOptions({ name: 'FloatingIndicator', inheritAttrs: false })

const props = withDefaults(defineProps<FloatingIndicatorOwnProps>(), {
  target: undefined,
  parent: undefined,
  transitionDuration: undefined,
  displayAfterTransitionEnd: false,
  component: 'div',
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<FloatingIndicatorSlots>()

const emit = defineEmits<{
  'transition-start': []
  'transition-end': []
}>()

const attrs = useAttrs()
const floatingRef = ref<HTMLElement | null>(null)
const shouldReduceMotion = useReducedMotion(false, { getInitialValueInEffect: false })
const getStyles = useStyles({
  name: 'FloatingIndicator',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  stylesCtx: {
    get shouldReduceMotion() {
      return shouldReduceMotion.value
    },
  },
})
const state = useFloatingIndicator({
  target: toRef(props, 'target'),
  parent: toRef(props, 'parent'),
  floatingRef,
  displayAfterTransitionEnd: props.displayAfterTransitionEnd,
  onTransitionStart: () => emit('transition-start'),
  onTransitionEnd: () => emit('transition-end'),
})
const shouldRender = computed(() => Boolean(props.target && props.parent))
const setFloatingRef = (node: any) => {
  floatingRef.value = node?.$el ?? node ?? null
}
</script>

<template>
  <Box
    v-if="shouldRender"
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :ref="setFloatingRef"
    :component="props.component"
    :mod="[{ initialized: state.initialized.value, hidden: state.hidden.value }, props.mod]"
  >
    <slot />
  </Box>
</template>
