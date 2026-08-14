<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useSliderContext } from '../Slider.context'
import type { SliderRootOwnProps, SliderRootSlots } from './SliderRoot.types'

defineOptions({
  name: 'SliderRoot',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SliderRootOwnProps>(), {
  rootRef: undefined,
  disabled: false,
  orientation: 'horizontal',
})

defineSlots<SliderRootSlots>()

const attrs = useAttrs()
const ctx = useSliderContext()

const rootStyles = computed(() =>
  ctx.getStyles('root', { className: attrs.class, style: attrs.style }),
)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="{ ...attrs, ...rootStyles }"
    :tabindex="-1"
    :variant="props.variant"
    :mod="{ orientation: props.orientation }"
  >
    <slot />
  </Box>
</template>
