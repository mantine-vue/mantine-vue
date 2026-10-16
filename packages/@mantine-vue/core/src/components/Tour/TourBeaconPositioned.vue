<script setup lang="ts">
import { computed, ref } from 'vue'
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import { Box } from '../../core'
import { useTourContext } from './Tour.context'
import type { TourTarget } from './Tour.types'

const props = defineProps<{
  target?: TourTarget
  label: string
}>()

const emit = defineEmits<{ click: [] }>()
const ctx = useTourContext()
const target = computed(() =>
  typeof props.target === 'string'
    ? typeof document === 'undefined'
      ? null
      : document.querySelector<HTMLElement>(props.target)
    : (props.target?.value ?? null),
)
const floating = ref<HTMLElement | null>(null)
const { floatingStyles } = useFloating(target, floating, {
  placement: 'top-end',
  middleware: [offset({ mainAxis: -4, crossAxis: -4 })],
  whileElementsMounted: autoUpdate,
})
</script>

<template>
  <Box
    v-if="target"
    component="button"
    type="button"
    :root-ref="(node: any) => (floating = node?.$el ?? node)"
    v-bind="ctx.getStyles('beacon')"
    :style="[ctx.getStyles('beacon').style, floatingStyles]"
    :aria-label="props.label"
    @click="emit('click')"
  >
    <span v-bind="ctx.getStyles('beaconPulse')" />
  </Box>
</template>
