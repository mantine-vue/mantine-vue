<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'
import type { DataListItemOwnProps, DataListItemSlots } from './DataListItem.types'

defineOptions({ name: 'DataListItem', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DataListItemOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<DataListItemSlots>()

const attrs = useAttrs()
const props = useProps('DataListItem', null, rawProps)
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
      ...ctx.getStyles('item', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    :mod="props.mod"
  >
    <slot />
  </Box>
</template>
