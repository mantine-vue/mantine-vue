<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { Collapse } from '../../Collapse'
import { useAccordionContext } from '../Accordion.context'
import { useAccordionItemContext } from '../AccordionItem.context'
import type { AccordionPanelOwnProps, AccordionPanelSlots } from './AccordionPanel.types'

defineOptions({ name: 'AccordionPanel', inheritAttrs: false })
const props = withDefaults(defineProps<AccordionPanelOwnProps>(), {
  keepMounted: undefined,
  classNames: undefined,
  styles: undefined,
})
defineSlots<AccordionPanelSlots>()

const emit = defineEmits<{
  'transition-end': []
  'transition-start': []
}>()
const attrs = useAttrs()
const { value } = useAccordionItemContext()
const ctx = useAccordionContext()

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Collapse
    :root-ref="setRootRef"
    v-bind="{
      ...attrs,
      ...ctx.getStyles('panel', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
        props,
      }),
      expanded: ctx.isItemActive(value),
      transitionDuration: ctx.transitionDuration ?? 200,
      role: 'region',
      id: ctx.getRegionId(value),
      'aria-labelledby': ctx.getControlId(value),
      keepMounted: props.keepMounted ?? ctx.keepMounted,
      onTransitionEnd: () => emit('transition-end'),
      onTransitionStart: () => emit('transition-start'),
    }"
  >
    <Box
      component="div"
      v-bind="
        ctx.getStyles('content', {
          classNames: props.classNames,
          styles: props.styles,
          props,
        })
      "
      ><slot
    /></Box>
  </Collapse>
</template>
