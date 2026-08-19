<script setup lang="ts">
import clsx from 'clsx'
import { RangeSlider } from '@mantine-vue/core'
import { computed, ref, useAttrs, watch } from 'vue'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_FilterRangeSlider.module.css'

defineOptions({ name: 'MVTFilterRangeSlider', inheritAttrs: false })

const props = defineProps<{
  header: MVT_Header<MVT_RowData>
  table: MVT_TableInstance<MVT_RowData>
}>()

const attrs = useAttrs()

const sliderProps = computed(() => {
  const { column } = props.header
  const context = { column, table: props.table }
  return {
    ...parseFromValuesOrFunc(props.table.options.mantineFilterRangeSliderProps, context),
    ...parseFromValuesOrFunc(column.columnDef.mantineFilterRangeSliderProps, context),
    ...attrs,
  } as Record<string, any>
})

const bounds = computed<[number, number]>(() => {
  const { min: minProp, max: maxProp } = sliderProps.value
  let [min, max] =
    minProp !== undefined && maxProp !== undefined
      ? [minProp, maxProp]
      : (props.header.column.getFacetedMinMaxValues() ?? [0, 1])
  if (Array.isArray(min)) min = min[0]
  if (Array.isArray(max)) max = max[0]
  return [min ?? 0, max ?? 1]
})

const values = ref<[number, number]>(
  (props.header.column.getFilterValue() as [number, number]) ?? bounds.value,
)

watch(
  () => props.header.column.getFilterValue(),
  (value) => {
    values.value = Array.isArray(value) ? (value as [number, number]) : bounds.value
  },
)

const rangeSliderProps = computed(() => {
  const { column } = props.header
  const [min, max] = bounds.value

  return {
    class: clsx('mvt-filter-range-slider', classes.root, sliderProps.value.class),
    min,
    max,
    modelValue: values.value,
    ...sliderProps.value,
    onChange: (value: [number, number]) => {
      values.value = value
      sliderProps.value.onChange?.(value)
    },
    onChangeEnd: (value: [number, number]) => {
      column.setFilterValue(value[0] <= min && value[1] >= max ? undefined : value)
      sliderProps.value.onChangeEnd?.(value)
    },
  }
})
</script>

<template>
  <RangeSlider v-bind="rangeSliderProps" />
</template>
