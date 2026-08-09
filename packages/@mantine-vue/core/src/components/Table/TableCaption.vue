<script setup lang="ts">
import { useAttrs } from 'vue'
import TableElement from './TableElement.vue'
import type { TableElementOwnProps, TableElementSlots } from './TableElement.types'

defineOptions({
  name: 'TableCaption',
  inheritAttrs: false,
})

const props = defineProps<TableElementOwnProps>()

defineSlots<TableElementSlots>()

const attrs = useAttrs()
</script>

<template>
  <TableElement
    v-bind="{ ...attrs, ...props }"
    __element="caption"
    :__options="{ captionSide: true }"
    __name="TableCaption"
  >
    <slot />
  </TableElement>
</template>
