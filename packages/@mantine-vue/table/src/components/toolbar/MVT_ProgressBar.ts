import clsx from 'clsx'
import { Collapse, Progress } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_ProgressBar.module.css'

export const MVT_ProgressBar = defineComponent({
  name: 'MVTProgressBar',
  inheritAttrs: false,
  props: {
    isTopToolbar: { type: Boolean, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const { table, isTopToolbar } = props
      const state = table.getState()
      const progressProps = {
        ...parseFromValuesOrFunc(table.options.mantineProgressProps, { isTopToolbar, table }),
        ...attrs,
      }

      return h(
        Collapse,
        {
          class: clsx(classes.collapse, isTopToolbar && classes['collapse-top']),
          expanded: Boolean(state.isSaving || state.showProgressBars),
        } as any,
        () =>
          h(Progress, {
            animated: true,
            'aria-busy': 'true',
            'aria-label': 'Loading',
            radius: 0,
            value: 100,
            ...progressProps,
          } as any),
      )
    }
  },
})
