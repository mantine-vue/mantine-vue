<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
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
    v-bind="{ ...attrs, ...itemStyles }"
    :variant="ctx.variant"
    :mod="[{ active: ctx.isItemActive(props.value) }, props.mod]"
  >
    <slot />
  </Box>
</template>
