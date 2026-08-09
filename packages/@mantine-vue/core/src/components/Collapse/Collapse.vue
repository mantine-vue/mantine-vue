<script lang="ts">
const defaultProps = {
  transitionDuration: 200,
  transitionTimingFunction: 'ease',
  animateOpacity: true,
  orientation: 'vertical',
  keepMounted: true,
} as const
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useCollapse, useHorizontalCollapse, useReducedMotion } from '@mantine-vue/hooks'
import { Box, useMantineEnv, useMantineTheme } from '../../core'
import type { CollapseOwnProps, CollapseSlots } from './Collapse.types'

defineOptions({ name: 'Collapse', inheritAttrs: false })

const props = withDefaults(defineProps<CollapseOwnProps>(), {
  orientation: undefined,
  transitionDuration: undefined,
  transitionTimingFunction: undefined,
  animateOpacity: undefined,
  keepMounted: undefined,
})
defineSlots<CollapseSlots>()

const emit = defineEmits<{
  'transition-end': []
  'transition-start': []
}>()

const attrs = useAttrs()
const env = useMantineEnv()
const theme = useMantineTheme()
const shouldReduceMotion = useReducedMotion(false, { getInitialValueInEffect: false })
const transitionDuration = computed(
  () => props.transitionDuration ?? defaultProps.transitionDuration,
)
const transitionTimingFunction = computed(
  () => props.transitionTimingFunction ?? defaultProps.transitionTimingFunction,
)
const animateOpacity = computed(() => props.animateOpacity ?? defaultProps.animateOpacity)
const orientation = computed(() => props.orientation ?? defaultProps.orientation)
const keepMounted = computed(() => props.keepMounted ?? defaultProps.keepMounted)
const duration = computed(() =>
  theme.value.respectReducedMotion && shouldReduceMotion.value ? 0 : transitionDuration.value,
)
const collapseInput = {
  expanded: () => props.expanded,
  transitionDuration: duration,
  transitionTimingFunction,
  onTransitionEnd: () => emit('transition-end'),
  onTransitionStart: () => emit('transition-start'),
  keepMounted: false,
}
const verticalCollapse = useCollapse(collapseInput)
const horizontalCollapse = useHorizontalCollapse(collapseInput)
const activeCollapse = computed(() =>
  orientation.value === 'horizontal' ? horizontalCollapse : verticalCollapse,
)
const shouldRenderZeroDuration = computed(
  () => props.expanded || (keepMounted.value && env !== 'test'),
)
const shouldRenderAnimated = computed(
  () => keepMounted.value || activeCollapse.value.state.value !== 'exited',
)
const zeroDurationProps = computed(() => ({
  ...attrs,
  style: {
    ...(attrs.style as any),
    display: props.expanded ? undefined : 'none',
  },
}))
const animatedProps = computed(() => ({
  ...attrs,
  ...activeCollapse.value.getCollapseProps({
    style: {
      ...(attrs.style as any),
      opacity: props.expanded || !animateOpacity.value ? 1 : 0,
      transition: animateOpacity.value
        ? `opacity ${duration.value}ms ${transitionTimingFunction.value}`
        : 'none',
    },
  }),
}))
</script>

<template>
  <Box v-if="duration === 0 && shouldRenderZeroDuration" v-bind="zeroDurationProps">
    <slot />
  </Box>
  <Box v-else-if="duration !== 0 && shouldRenderAnimated" v-bind="animatedProps">
    <slot />
  </Box>
</template>
