<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useTabsContext } from '../Tabs.context'
import type { TabsListOwnProps, TabsListSlots } from './TabsList.types'

defineOptions({ name: 'TabsList', inheritAttrs: false })
const props = withDefaults(defineProps<TabsListOwnProps>(), {
  rootRef: undefined,
  justify: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
})
defineSlots<TabsListSlots>()
const attrs = useAttrs()
const ctx = useTabsContext()

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
    v-bind="{
      ...attrs,
      ...ctx.getStyles('list', {
        className: attrs.class,
        classNames: props.classNames,
        styles: props.styles,
        style: { '--tabs-justify': props.justify, ...(attrs.style as Record<string, any>) },
        props,
        variant: ctx.variant,
      }),
    }"
    role="tablist"
    :variant="ctx.variant"
    :mod="[
      {
        grow: props.grow,
        orientation: ctx.orientation,
        placement: ctx.orientation === 'vertical' && ctx.placement,
        inverted: ctx.inverted,
      },
      props.mod,
    ]"
    :aria-orientation="ctx.orientation"
    ><slot
  /></Box>
</template>
