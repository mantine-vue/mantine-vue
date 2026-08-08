<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'
import type { DataListItemOwnProps, DataListItemSlots } from './DataListItem.types'

defineOptions({ name: 'DataListItem', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DataListItemOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<DataListItemSlots>()

const attrs = useAttrs()
const props = useProps('DataListItem', null, rawProps)
const ctx = useDataListContext()
</script>

<template>
  <Box
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
