import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'

export type EmptyStateTitleStylesNames = 'title'

export interface EmptyStateTitleProps {
  /** Heading order, renders the title as `h1`–`h6` element. By default, the title is rendered as a `div` without semantic heading level */
  order?: 1 | 2 | 3 | 4 | 5 | 6
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface EmptyStateTitleSlots {
  default?: () => VNodeChild
}

export const EmptyStateTitle = withBoxProps(
  defineComponent({
    name: 'EmptyStateTitle',
    inheritAttrs: false,
    slots: Object as SlotsType<EmptyStateTitleSlots>,
    props: {
      order: { type: Number as PropType<1 | 2 | 3 | 4 | 5 | 6>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('EmptyStateTitle', null, rawProps)
      const ctx = useEmptyStateContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: props.order ? `h${props.order}` : 'div',
            mod: props.mod,
            ...ctx.getStyles('title', {
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
