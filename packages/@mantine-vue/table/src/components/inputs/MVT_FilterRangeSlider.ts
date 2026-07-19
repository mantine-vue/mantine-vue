import clsx from 'clsx'
import { RangeSlider } from '@mantine-vue/core'
import { defineComponent, h, ref, watch, type PropType } from 'vue'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_FilterRangeSlider.module.css'

export const MVT_FilterRangeSlider = defineComponent({
  name: 'MVTFilterRangeSlider',
  inheritAttrs: false,
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    const initial = () => {
      const p = {
        ...parseFromValuesOrFunc(props.table.options.mantineFilterRangeSliderProps, {
          column: props.header.column,
          table: props.table,
        }),
        ...parseFromValuesOrFunc(props.header.column.columnDef.mantineFilterRangeSliderProps, {
          column: props.header.column,
          table: props.table,
        }),
        ...attrs,
      } as Record<string, any>
      let [min, max] =
        p.min !== undefined && p.max !== undefined
          ? [p.min, p.max]
          : (props.header.column.getFacetedMinMaxValues() ?? [0, 1])
      if (Array.isArray(min)) min = min[0]
      if (Array.isArray(max)) max = max[0]
      return [min ?? 0, max ?? 1] as [number, number]
    }
    const values = ref<[number, number]>(
      (props.header.column.getFilterValue() as [number, number]) ?? initial(),
    )
    watch(
      () => props.header.column.getFilterValue(),
      (value) => {
        values.value = Array.isArray(value) ? (value as [number, number]) : initial()
      },
    )
    return () => {
      const [min, max] = initial()
      const { column } = props.header
      const rangeProps = {
        ...parseFromValuesOrFunc(props.table.options.mantineFilterRangeSliderProps, {
          column,
          table: props.table,
        }),
        ...parseFromValuesOrFunc(column.columnDef.mantineFilterRangeSliderProps, {
          column,
          table: props.table,
        }),
        ...attrs,
      } as Record<string, any>
      return h(RangeSlider, {
        class: clsx('mvt-filter-range-slider', classes.root, rangeProps.class),
        min,
        max,
        value: values.value,
        ...rangeProps,
        onChange: (value: [number, number]) => {
          values.value = value
          rangeProps.onChange?.(value)
        },
        onChangeEnd: (value: [number, number]) => {
          column.setFilterValue(value[0] <= min && value[1] >= max ? undefined : value)
          rangeProps.onChangeEnd?.(value)
        },
      } as any)
    }
  },
})
