import clsx from 'clsx'
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_GrabHandleButton.module.css'

export const MVT_GrabHandleButton = defineComponent({
  name: 'MVTGrabHandleButton',
  props: {
    actionIconProps: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    onDragEnd: { type: Function as PropType<(event: DragEvent) => void>, required: true },
    onDragStart: { type: Function as PropType<(event: DragEvent) => void>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { slots }) {
    return () => {
      const { actionIconProps, table } = props
      const label = actionIconProps.title ?? table.options.localization.move
      return h(Tooltip, { label, openDelay: 1000, withinPortal: true }, () =>
        h(
          ActionIcon,
          {
            'aria-label': label,
            draggable: true,
            ...actionIconProps,
            class: clsx('mvt-grab-handle-button', classes['grab-icon'], actionIconProps.class),
            color: 'gray',
            size: 'sm',
            title: undefined,
            variant: 'transparent',
            onClick: (event: MouseEvent) => {
              event.stopPropagation()
              actionIconProps.onClick?.(event)
            },
            onDragend: props.onDragEnd,
            onDragstart: props.onDragStart,
          } as any,
          () =>
            slots.default?.({ table }) ??
            h(table.options.icons.IconGripHorizontal, { size: '100%' }),
        ),
      )
    }
  },
})
