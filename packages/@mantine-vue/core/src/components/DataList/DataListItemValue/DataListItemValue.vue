<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useDataListContext } from '../DataList.context'
import type { DataListItemValueOwnProps, DataListItemValueSlots } from './DataListItemValue.types'

defineOptions({ name: 'DataListItemValue', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DataListItemValueOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  mod: undefined,
})
defineSlots<DataListItemValueSlots>()

const attrs = useAttrs()
const props = useProps('DataListItemValue', null, rawProps)
const ctx = useDataListContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('itemValue', {
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    component="dd"
    :mod="props.mod"
  >
    <slot />
  </Box>
</template>
