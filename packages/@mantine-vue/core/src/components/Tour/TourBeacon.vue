<script setup lang="ts">
import { computed, ref } from 'vue'
import { autoUpdate, offset, useFloating } from '@floating-ui/vue'
import { Box } from '../../core'
import { useTourContext } from './Tour.context'
import type { TourBeaconProps } from './Tour.types'
const props = defineProps<TourBeaconProps>()
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
  placement: 'top',
  middleware: [offset(({ rects }) => -rects.reference.height / 2)],
  whileElementsMounted: autoUpdate,
})
</script>
<template>
  <Box
    component="button"
    type="button"
    :root-ref="(node: any) => (floating = node?.$el ?? node)"
    v-bind="ctx.getStyles('beacon')"
    :style="[floatingStyles, ctx.getStyles('beacon').style]"
    :aria-label="ctx.labels.beacon"
    ><span v-bind="ctx.getStyles('beaconPulse')"
  /></Box>
</template>
