<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { Box, useDirection } from '../../core'
import { getFloatingPosition } from '../../utils/Floating'
import { FocusTrap } from '../FocusTrap'
import { Transition as MantineTransition } from '../Transition'
import { useTourContext } from './Tour.context'
import type { TourTooltipProps } from './Tour.types'
defineOptions({ name: 'TourTooltip', inheritAttrs: false })
const props = withDefaults(defineProps<TourTooltipProps>(), { position: 'bottom', mounted: false })
const attrs = useAttrs()
const ctx = useTourContext()
const { dir } = useDirection()
const floating = ref<HTMLElement | null>(null)
const target = computed(() => props.targetElement ?? null)
const { floatingStyles } = useFloating(target, floating, {
  placement: computed(() => getFloatingPosition(dir.value, props.position)),
  middleware: [offset(12), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
})
const trapActive = computed(() => props.mounted && ctx.withOverlay && !ctx.withOverlayInteraction)
const transition = computed<any>(() => ({
  duration: 200,
  transition: 'fade',
  ...props.transitionProps,
}))
watch(target, (value) => ctx.setTargetElement(value), { immediate: true })
onBeforeUnmount(() => ctx.setTargetElement(null))
</script>
<template>
  <MantineTransition :mounted="props.mounted" v-bind="transition"
    ><template #default="transitionStyle"
      ><FocusTrap :active="trapActive"
        ><Box
          :root-ref="(node: any) => (floating = node?.$el ?? node)"
          v-bind="{
            ...ctx.getStyles('tooltip', { className: attrs.class, style: attrs.style }),
            ...attrs,
          }"
          :role="attrs.role ?? 'dialog'"
          :tabindex="attrs.tabindex ?? -1"
          :aria-labelledby="
            attrs['aria-labelledby'] ?? (ctx.titleMounted ? ctx.titleId : undefined)
          "
          :aria-label="
            attrs['aria-label'] ??
            (ctx.titleMounted ? undefined : ctx.labels.stepCounter(ctx.step + 1, ctx.stepsCount))
          "
          :aria-describedby="
            attrs['aria-describedby'] ?? (ctx.bodyMounted ? ctx.bodyId : undefined)
          "
          :data-centered="!target || undefined"
          :style="[ctx.getStyles('tooltip').style, target ? floatingStyles : {}, transitionStyle]"
          ><FocusTrap.InitialFocus v-if="trapActive" /><slot /></Box></FocusTrap></template
  ></MantineTransition>
</template>
