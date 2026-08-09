<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'
import type { DataListItemLabelOwnProps, DataListItemLabelSlots } from './DataListItemLabel.types'

defineOptions({ name: 'DataListItemLabel', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DataListItemLabelOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<DataListItemLabelSlots>()

const attrs = useAttrs()
const props = useProps('DataListItemLabel', null, rawProps)
const ctx = useDataListContext()
</script>

<template>
  <Box
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
