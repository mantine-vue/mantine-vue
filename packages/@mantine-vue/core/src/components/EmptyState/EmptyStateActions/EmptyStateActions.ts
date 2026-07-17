import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'

export type EmptyStateActionsStylesNames = 'actions'

export interface EmptyStateActionsProps {
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface EmptyStateActionsSlots {
  default?: () => VNodeChild
}

export const EmptyStateActions = withBoxProps(
  defineComponent({
    name: 'EmptyStateActions',
    inheritAttrs: false,
    slots: Object as SlotsType<EmptyStateActionsSlots>,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('EmptyStateActions', null, rawProps)
      const ctx = useEmptyStateContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            mod: props.mod,
            ...ctx.getStyles('actions', {
              className: attrs.class,
              style: attrs.style as any,
              classNames: props.classNames,
              styles: props.styles,
            }),
          },
          () => slots.default?.(),
        )
    },
  }),
)
