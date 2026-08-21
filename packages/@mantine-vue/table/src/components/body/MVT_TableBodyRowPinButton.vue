<script setup lang="ts">
import { Box } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_RowPinButton from '../buttons/MVT_RowPinButton.vue'

defineOptions({ name: 'MVTTableBodyRowPinButton', inheritAttrs: false })

const props = defineProps<{
  row: MVT_Row<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const isEnabled = computed(
  () => !!parseFromValuesOrFunc(props.table.options.enableRowPinning, props.row as any),
)

const showBothDirections = computed(
  () => props.table.options.rowPinningDisplayMode === 'top-and-bottom' && !props.row.getIsPinned(),
)

const singlePinningPosition = computed(() =>
  props.table.options.rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top',
)

const stackStyle = computed(() => ({
  display: 'flex',
  flexDirection: props.table.getState().density === 'xs' ? 'row' : 'column',
}))
</script>

<template>
  <template v-if="isEnabled">
    <Box v-if="showBothDirections" :style="stackStyle">
      <MVT_RowPinButton v-bind="attrs" :row="row" :table="table" pinningPosition="top" />
      <MVT_RowPinButton v-bind="attrs" :row="row" :table="table" pinningPosition="bottom" />
    </Box>
    <MVT_RowPinButton
      v-else
      v-bind="attrs"
      :row="row"
      :table="table"
      :pinningPosition="singlePinningPosition"
    />
  </template>
</template>
