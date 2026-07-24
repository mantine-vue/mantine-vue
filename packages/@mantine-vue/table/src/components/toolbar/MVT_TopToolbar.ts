import { defineComponent, h, type PropType } from 'vue'

import { Box, Flex } from '@mantine-vue/core'

import clsx from 'clsx'

import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_GlobalFilterTextInput } from '../inputs/MVT_GlobalFilterTextInput'
import { MVT_ProgressBar } from './MVT_ProgressBar'
import { MVT_TablePagination } from './MVT_TablePagination'
import { MVT_ToolbarAlertBanner } from './MVT_ToolbarAlertBanner'
import { MVT_ToolbarDropZone } from './MVT_ToolbarDropZone'
import { MVT_ToolbarInternalButtons } from './MVT_ToolbarInternalButtons'
import commonClasses from './common.styles.module.css'
import classes from './MVT_TopToolbar.module.css'
import { useMediaQuery } from '@mantine-vue/hooks'

export const MVT_TopToolbar = defineComponent({
  name: 'MVTTopToolbar',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const isMobile = useMediaQuery('(max-width: 720px)')
    const isTablet = useMediaQuery('(max-width: 1024px)')

    return () => {
      const { table } = props
      const {
        getState,
        options: {
          enableGlobalFilter,
          enablePagination,
          enableToolbarInternalActions,
          mantineTopToolbarProps,
          positionGlobalFilter,
          positionPagination,
          positionToolbarAlertBanner,
          positionToolbarDropZone,
          renderTopToolbarCustomActions,
        },
        refs: { topToolbarRef },
      } = table

      const { isFullScreen, showGlobalFilter } = getState()

      const toolbarProps = {
        ...parseFromValuesOrFunc(mantineTopToolbarProps, { table }),
        ...attrs,
      }

      const stackAlertBanner =
        isMobile.value || !!renderTopToolbarCustomActions || (showGlobalFilter && isTablet.value)

      const globalFilterProps = {
        style: !isTablet.value ? { zIndex: 3 } : undefined,
        table,
      }

      return h(
        Box,
        {
          ...toolbarProps,
          class: clsx(
            commonClasses['common-toolbar-styles'],
            classes['root'],
            isFullScreen && classes['root-fullscreen'],
            (toolbarProps as any)?.class,
          ),
          ref: (el: any) => {
            const node = (el?.$el ?? el) as HTMLDivElement
            if (node) {
              topToolbarRef.value = node
              if ((toolbarProps as any)?.ref) {
                ;(toolbarProps as any).ref.value = node
              }
            }
          },
        } as any,
        () => [
          positionToolbarAlertBanner === 'top' &&
            h(MVT_ToolbarAlertBanner, { stackAlertBanner, table } as any),
          ['both', 'top'].includes(positionToolbarDropZone ?? '') &&
            h(MVT_ToolbarDropZone, { table } as any),
          h(
            Flex,
            {
              class: [
                classes['actions-container'],
                stackAlertBanner ? classes['actions-container-stack-alert'] : undefined,
              ],
            } as any,
            () => [
              enableGlobalFilter &&
                positionGlobalFilter === 'left' &&
                h(MVT_GlobalFilterTextInput, globalFilterProps as any),
              parseFromValuesOrFunc(renderTopToolbarCustomActions, { table }) ?? h('span'),
              enableToolbarInternalActions
                ? h(Flex, { justify: 'end', wrap: 'wrap-reverse' } as any, () => [
                    enableGlobalFilter &&
                      positionGlobalFilter === 'right' &&
                      h(MVT_GlobalFilterTextInput, globalFilterProps as any),
                    h(MVT_ToolbarInternalButtons, { table } as any),
                  ])
                : enableGlobalFilter &&
                  positionGlobalFilter === 'right' &&
                  h(MVT_GlobalFilterTextInput, globalFilterProps as any),
            ],
          ),
          enablePagination &&
            ['both', 'top'].includes(positionPagination ?? '') &&
            h(Flex, { justify: 'end' } as any, () =>
              h(MVT_TablePagination, { position: 'top', table } as any),
            ),
          h(MVT_ProgressBar, { isTopToolbar: true, table } as any),
        ],
      )
    }
  },
})
