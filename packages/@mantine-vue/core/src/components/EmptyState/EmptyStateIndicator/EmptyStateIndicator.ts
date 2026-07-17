import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'

export type EmptyStateIndicatorStylesNames = 'indicator'

export interface EmptyStateIndicatorProps {
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface EmptyStateIndicatorSlots {
  default?: () => VNodeChild
}

export const EmptyStateIndicator = withBoxProps(
  defineComponent({
    name: 'EmptyStateIndicator',
    inheritAttrs: false,
    slots: Object as SlotsType<EmptyStateIndicatorSlots>,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('EmptyStateIndicator', null, rawProps)
      const ctx = useEmptyStateContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            mod: [{ 'with-background': ctx.withIndicatorBackground }, props.mod],
            ...ctx.getStyles('indicator', {
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
