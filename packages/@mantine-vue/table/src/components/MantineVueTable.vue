<script setup lang="ts">
import { useAttrs, useSlots, type Slots } from 'vue'

import { useMantineVueTable } from '../hooks/useMantineVueTable'
import { type MVT_RowData, type MVT_TableInstance, type MVT_TableOptions } from '../types'
import { type MVT_TableSlots, provideMVT_Slots } from './MVT_TableSlots'
import MVT_TablePaper from './table/MVT_TablePaper.vue'

defineOptions({ name: 'MantineVueTable', inheritAttrs: false })

const props = withDefaults(defineProps<{ table?: object }>(), { table: undefined })

defineSlots<MVT_TableSlots>()

const attrs = useAttrs()
const slots = useSlots()

const table =
  (props.table as MVT_TableInstance<MVT_RowData> | undefined) ??
  useMantineVueTable(attrs as unknown as MVT_TableOptions<MVT_RowData>)

const rawSlots = slots as unknown as Slots
provideMVT_Slots(rawSlots)
;(table as any).setMVTSlots?.(rawSlots)
</script>

<template>
  <MVT_TablePaper :table="table" />
</template>
