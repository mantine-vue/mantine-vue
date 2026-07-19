import { defineComponent, h, onMounted, type PropType, ref } from 'vue'

import { Box, LoadingOverlay } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_EditRowModal } from '../modals/MVT_EditRowModal'
import { MVT_Table } from './MVT_Table'
import classes from './MVT_TableContainer.module.css'

export const MVT_TableContainer = defineComponent({
  name: 'MVTTableContainer',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const totalToolbarHeight = ref(0)

    onMounted(() => {
      const { bottomToolbarRef, topToolbarRef } = props.table.refs
      const topToolbarHeight = topToolbarRef.value?.offsetHeight ?? 0
      const bottomToolbarHeight = bottomToolbarRef.value?.offsetHeight ?? 0
      totalToolbarHeight.value = topToolbarHeight + bottomToolbarHeight
    })

    return () => {
      const { table } = props
      const {
        getState,
        options: {
          createDisplayMode,
          editDisplayMode,
          enableStickyHeader,
          mantineLoadingOverlayProps,
          mantineTableContainerProps,
        },
        refs: { tableContainerRef },
      } = table
      const { creatingRow, editingRow, isFullScreen, isLoading, showLoadingOverlay } = getState()

      const tableContainerProps = {
        ...parseFromValuesOrFunc(mantineTableContainerProps, { table }),
        ...attrs,
      }
      const loadingOverlayProps = parseFromValuesOrFunc(mantineLoadingOverlayProps, { table })

      const createModalOpen = createDisplayMode === 'modal' && creatingRow
      const editModalOpen = editDisplayMode === 'modal' && editingRow

      return h(
        Box,
        {
          ...tableContainerProps,
          style: {
            '--mvt-top-toolbar-height': `${totalToolbarHeight.value}`,
            ...(tableContainerProps as any)?.style,
          },
          class: clsx(
            'mvt-table-container',
            classes.root,
            enableStickyHeader && classes['root-sticky'],
            isFullScreen && classes['root-fullscreen'],
            (tableContainerProps as any)?.class,
          ),
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLDivElement
            if (node) {
              tableContainerRef.value = node
              if ((tableContainerProps as any)?.ref) {
                ;(tableContainerProps as any).ref.value = node
              }
            }
          },
        } as any,
        () => [
          h(LoadingOverlay, {
            visible: isLoading || showLoadingOverlay,
            zIndex: 2,
            ...loadingOverlayProps,
          } as any),
          h(MVT_Table, { table } as any),
          (createModalOpen || editModalOpen) && h(MVT_EditRowModal, { open: true, table } as any),
        ],
      )
    }
  },
})
