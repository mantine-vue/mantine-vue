import { defineComponent, h, type PropType, ref } from 'vue'

import { Tooltip, UnstyledButton } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_Cell, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MVT_CopyButton.module.css'

export const MVT_CopyButton = defineComponent({
  name: 'MVTCopyButton',
  inheritAttrs: false,
  props: {
    cell: {
      type: Object as PropType<MVT_Cell<MVT_RowData>>,
      required: true,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const copied = ref(false)
    return () => {
      const { cell, table } = props
      const {
        options: { localization, mantineCopyButtonProps },
      } = table
      const { column, row } = cell

      const copyButtonProps = {
        ...parseFromValuesOrFunc(mantineCopyButtonProps, {
          cell,
          column,
          row,
          table,
        }),
        ...parseFromValuesOrFunc(column.columnDef.mantineCopyButtonProps, {
          cell,
          column,
          row,
          table,
        }),
        ...attrs,
      }

      const handleCopy = () => {
        navigator?.clipboard?.writeText(cell.getValue<any>()?.toString())
        copied.value = true
        setTimeout(() => (copied.value = false), 4000)
      }

      return h(
        Tooltip,
        {
          color: copied.value ? 'teal' : undefined,
          label: copied.value ? localization.copiedToClipboard : localization.clickToCopy,
          openDelay: 1000,
          withinPortal: true,
        } as any,
        () =>
          h(
            UnstyledButton,
            {
              ...copyButtonProps,
              onClick: (event: MouseEvent) => {
                event.stopPropagation()
                handleCopy()
                ;(copyButtonProps as any)?.onClick?.(event)
              },
              class: clsx(classes.root, (copyButtonProps as any)?.class),
            } as any,
            () => slots.default?.(),
          ),
      )
    }
  },
})
