<script setup lang="ts">
import { useAttrs } from 'vue'
import TableElement from './TableElement.vue'
import type { TableElementOwnProps, TableElementSlots } from './TableElement.types'

defineOptions({
  name: 'TableTfoot',
  inheritAttrs: false,
})

const props = defineProps<TableElementOwnProps>()

defineSlots<TableElementSlots>()

const attrs = useAttrs()
</script>

<template>
  <TableElement
    v-bind="{ ...attrs, ...props }"
    __element="tfoot"
    :__options="undefined"
    __name="TableTfoot"
  >
    <slot />
  </TableElement>
</template>
