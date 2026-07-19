import { defineComponent, h, onBeforeUnmount, type PropType, Teleport, watch } from 'vue'

import { Paper, useMantineTheme } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_BottomToolbar } from '../toolbar/MVT_BottomToolbar'
import { MVT_TopToolbar } from '../toolbar/MVT_TopToolbar'
import { MVT_TableContainer } from './MVT_TableContainer'
import classes from './MVT_TablePaper.module.css'

export const MVT_TablePaper = defineComponent({
  name: 'MVTTablePaper',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const theme = useMantineTheme()

    // Lock body scroll while full screen so the scrollbar moves the table's own
    // container instead of the page behind it.
    const setBodyScrollLock = (locked: boolean) => {
      if (typeof document === 'undefined') return
      document.body.style.overflow = locked ? 'hidden' : ''
    }

    watch(
      () => props.table.getState().isFullScreen,
      (isFullScreen) => setBodyScrollLock(!!isFullScreen),
    )

    onBeforeUnmount(() => setBodyScrollLock(false))

    return () => {
      const { table } = props
      const {
        getState,
        options: {
          enableBottomToolbar,
          enableTopToolbar,
          mantinePaperProps,
          renderBottomToolbar,
          renderTopToolbar,
        },
        refs: { tablePaperRef },
      } = table
      const { isFullScreen } = getState()

      const tablePaperProps = {
        ...parseFromValuesOrFunc(mantinePaperProps, { table }),
        ...attrs,
      }

      const style = {
        zIndex: isFullScreen ? 200 : undefined,
        ...parseFromValuesOrFunc(tablePaperProps?.style as any, theme),
        ...(isFullScreen
          ? {
              border: 0,
              borderRadius: 0,
              bottom: 0,
              height: '100vh',
              left: 0,
              margin: 0,
              maxHeight: '100vh',
              maxWidth: '100vw',
              padding: 0,
              position: 'fixed',
              right: 0,
              top: 0,
              width: '100vw',
            }
          : null),
      }

      const paper = h(
        Paper,
        {
          shadow: 'xs',
          withBorder: true,
          ...tablePaperProps,
          class: clsx(
            'mvt-table-paper',
            classes.root,
            isFullScreen && 'mvt-table-paper-fullscreen',
            (tablePaperProps as any)?.class,
          ),
          ref: (el: any) => {
            tablePaperRef.value = (el?.$el ?? el) as HTMLDivElement
            if ((tablePaperProps as any)?.ref) {
              ;(tablePaperProps as any).ref.value = tablePaperRef.value
            }
          },
          style,
        } as any,
        () => [
          enableTopToolbar &&
            (parseFromValuesOrFunc(renderTopToolbar, { table }) ??
              h(MVT_TopToolbar, { table } as any)),
          h(MVT_TableContainer, { table } as any),
          enableBottomToolbar &&
            (parseFromValuesOrFunc(renderBottomToolbar, { table }) ??
              h(MVT_BottomToolbar, { table } as any)),
        ],
      )

      // Teleport to <body> while full screen so `position: fixed` is relative to
      // the viewport and lands in the root stacking context. Otherwise a
      // transformed / stacking-context ancestor (common in docs shells and app
      // layouts) traps it, leaving the table behind the page header/sidebar.
      // `disabled` keeps the same instance mounted when toggling in/out.
      return h(Teleport, { disabled: !isFullScreen, to: 'body' }, [paper])
    }
  },
})
