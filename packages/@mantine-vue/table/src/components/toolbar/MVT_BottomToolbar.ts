import { defineComponent, h, type PropType } from 'vue'

import { Box } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_ProgressBar } from './MVT_ProgressBar'
import { MVT_TablePagination } from './MVT_TablePagination'
import { MVT_ToolbarAlertBanner } from './MVT_ToolbarAlertBanner'
import { MVT_ToolbarDropZone } from './MVT_ToolbarDropZone'
import commonClasses from './common.styles.module.css'
import classes from './MVT_BottomToolbar.module.css'
import { useMediaQuery } from '@mantine-vue/hooks'

export const MVT_BottomToolbar = defineComponent({
  name: 'MVTBottomToolbar',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const isMobile = useMediaQuery('(max-width: 720px)')

    return () => {
      const { table } = props
      const {
        getState,
        options: {
          enablePagination,
          mantineBottomToolbarProps,
          positionPagination,
          positionToolbarAlertBanner,
          positionToolbarDropZone,
          renderBottomToolbarCustomActions,
        },
        refs: { bottomToolbarRef },
      } = table
      const { isFullScreen } = getState()

      const toolbarProps = {
        ...parseFromValuesOrFunc(mantineBottomToolbarProps, { table }),
        ...attrs,
      }

      const stackAlertBanner = isMobile.value || !!renderBottomToolbarCustomActions

      return h(
        Box,
        {
          ...toolbarProps,
          class: clsx(
            'mvt-bottom-toolbar',
            classes.root,
            commonClasses['common-toolbar-styles'],
            isFullScreen && classes['root-fullscreen'],
            (toolbarProps as any)?.class,
          ),
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLDivElement
            if (node) {
              bottomToolbarRef.value = node
              if ((toolbarProps as any)?.ref) {
                ;(toolbarProps as any).ref.value = node
              }
            }
          },
        } as any,
        () => [
          h(MVT_ProgressBar, { isTopToolbar: false, table } as any),
          positionToolbarAlertBanner === 'bottom' &&
            h(MVT_ToolbarAlertBanner, { stackAlertBanner, table } as any),
          ['both', 'bottom'].includes(positionToolbarDropZone ?? '') &&
            h(MVT_ToolbarDropZone, { table } as any),
          h(Box, { class: classes['custom-toolbar-container'] } as any, () => [
            parseFromValuesOrFunc(renderBottomToolbarCustomActions, {
              table,
            }) ?? h('span'),
            h(
              Box,
              {
                class: clsx(
                  classes['paginator-container'],
                  stackAlertBanner && classes['paginator-container-alert-banner'],
                ),
              } as any,
              () =>
                enablePagination &&
                ['both', 'bottom'].includes(positionPagination ?? '') &&
                h(MVT_TablePagination, { position: 'bottom', table } as any),
            ),
          ]),
        ],
      )
    }
  },
})
