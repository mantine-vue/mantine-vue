<script setup lang="ts">
import { useAttrs } from 'vue'
import TableElement from './TableElement.vue'
import type { TableElementOwnProps, TableElementSlots } from './TableElement.types'

defineOptions({
  name: 'TableTr',
  inheritAttrs: false,
})

const props = defineProps<TableElementOwnProps>()

defineSlots<TableElementSlots>()

const attrs = useAttrs()
</script>

<template>
  <TableElement
    v-bind="{ ...attrs, ...props }"
    __element="tr"
    :__options="{ rowBorder: true, striped: true, highlightOnHover: true }"
    __name="TableTr"
  >
    <slot />
  </TableElement>
</template>
