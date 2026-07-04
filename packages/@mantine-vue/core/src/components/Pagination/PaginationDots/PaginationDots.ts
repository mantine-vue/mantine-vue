import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { PaginationDotsIcon } from '../Pagination.icons'
import { usePaginationContext } from '../Pagination.context'

export const PaginationDots = withBoxProps(
  defineComponent({
    name: 'PaginationDots',
    inheritAttrs: false,
    props: {
      icon: { type: [Object, Function] as PropType<any>, default: undefined },
    },
    setup(props, { attrs }) {
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
          () => h(Icon),
        )
      }
    },
  }),
)
