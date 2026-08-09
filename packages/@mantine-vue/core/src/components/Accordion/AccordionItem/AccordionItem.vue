<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box } from '../../../core'
import { useAccordionContext } from '../Accordion.context'
import { provideAccordionItemContext } from '../AccordionItem.context'
import type { AccordionItemOwnProps, AccordionItemSlots } from './AccordionItem.types'

defineOptions({
  name: 'AccordionItem',
  inheritAttrs: false,
})

const props = defineProps<AccordionItemOwnProps>()

defineSlots<AccordionItemSlots>()

const attrs = useAttrs()
const ctx = useAccordionContext()

provideAccordionItemContext({ value: props.value })

const itemStyles = computed(() =>
  ctx.getStyles('item', {
    className: attrs.class,
    style: attrs.style as any,
    classNames: props.classNames,
    styles: props.styles,
    props,
    variant: ctx.variant,
  }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...itemStyles }"
    :variant="ctx.variant"
    :mod="[{ active: ctx.isItemActive(props.value) }, props.mod]"
  >
    <slot />
  </Box>
</template>
