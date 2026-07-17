import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useEmptyStateContext } from '../EmptyState.context'

export type EmptyStateDescriptionStylesNames = 'description'

export interface EmptyStateDescriptionProps {
  classNames?: any
  styles?: any
  mod?: any
  [key: string]: any
}

export interface EmptyStateDescriptionSlots {
  default?: () => VNodeChild
}

export const EmptyStateDescription = withBoxProps(
  defineComponent({
    name: 'EmptyStateDescription',
    inheritAttrs: false,
    slots: Object as SlotsType<EmptyStateDescriptionSlots>,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      mod: { type: [Object, Array, String] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('EmptyStateDescription', null, rawProps)
      const ctx = useEmptyStateContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'p',
            mod: props.mod,
            ...ctx.getStyles('description', {
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
