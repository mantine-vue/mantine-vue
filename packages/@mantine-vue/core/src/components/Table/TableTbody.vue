<script setup lang="ts">
import { useAttrs } from 'vue'
import TableElement from './TableElement.vue'
import type { TableElementOwnProps, TableElementSlots } from './TableElement.types'

defineOptions({
  name: 'TableTbody',
  inheritAttrs: false,
})

const props = defineProps<TableElementOwnProps>()

defineSlots<TableElementSlots>()

const attrs = useAttrs()
</script>

<template>
  <TableElement
    v-bind="{ ...attrs, ...props }"
    __element="tbody"
    :__options="undefined"
    __name="TableTbody"
  >
    <slot />
  </TableElement>
</template>
