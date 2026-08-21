<script setup lang="ts">
import clsx from 'clsx'
import { Box } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import MVT_FilterTextInput from './MVT_FilterTextInput.vue'
import classes from './MVT_FilterRangeFields.module.css'

defineOptions({ name: 'MVTFilterRangeFields', inheritAttrs: false })

defineProps<{
  header: MVT_Header<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const rootProps = computed(() => ({
  ...attrs,
  class: clsx('mvt-filter-range-fields', classes.root, attrs.class),
}))
</script>

<template>
  <Box v-bind="rootProps">
    <MVT_FilterTextInput :header="header" :rangeFilterIndex="0" :table="table" />
    <MVT_FilterTextInput :header="header" :rangeFilterIndex="1" :table="table" />
  </Box>
</template>
