import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { PaginationDotsIcon } from '../Pagination.icons'
import { usePaginationContext } from '../Pagination.context'

export interface PaginationDotsSlots {
  icon?: () => VNodeChild
}

export const PaginationDots = withBoxProps(
  defineComponent({
    name: 'PaginationDots',
    inheritAttrs: false,
    slots: Object as SlotsType<PaginationDotsSlots>,
    props: {
      icon: { type: [Object, Function] as PropType<any>, default: undefined },
    },
    setup(props, { attrs, slots }) {
      const ctx = usePaginationContext()

      return () => {
        const Icon = props.icon ?? PaginationDotsIcon

        return h(
          Box,
          {
            ...attrs,
            component: 'span',
            ...ctx.getStyles('dots', { className: attrs.class, style: attrs.style as any }),
          },
          () => (slots.icon ? slots.icon() : h(Icon)),
        )
      }
    },
  }),
)
