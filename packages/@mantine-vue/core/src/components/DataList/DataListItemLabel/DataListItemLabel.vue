<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'
import type { DataListItemLabelOwnProps, DataListItemLabelSlots } from './DataListItemLabel.types'

defineOptions({ name: 'DataListItemLabel', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DataListItemLabelOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<DataListItemLabelSlots>()

const attrs = useAttrs()
const props = useProps('DataListItemLabel', null, rawProps)
const ctx = useDataListContext()

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
      ...ctx.getStyles('itemLabel', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    component="dt"
    :mod="props.mod"
  >
    <slot />
  </Box>
</template>
