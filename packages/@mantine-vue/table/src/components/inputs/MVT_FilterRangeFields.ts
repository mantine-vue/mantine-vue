import clsx from 'clsx'
import { Box } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { MVT_FilterTextInput } from './MVT_FilterTextInput'
import classes from './MVT_FilterRangeFields.module.css'

export const MVT_FilterRangeFields = defineComponent({
  name: 'MVTFilterRangeFields',
  inheritAttrs: false,
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        Box,
        { ...attrs, class: clsx('mvt-filter-range-fields', classes.root, attrs.class) },
        () => [
          h(MVT_FilterTextInput, { header: props.header, rangeFilterIndex: 0, table: props.table }),
          h(MVT_FilterTextInput, { header: props.header, rangeFilterIndex: 1, table: props.table }),
        ],
      )
  },
})
