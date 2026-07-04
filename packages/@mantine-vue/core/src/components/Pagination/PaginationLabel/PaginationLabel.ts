import { defineComponent, h } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { usePaginationContext } from '../Pagination.context'

export const PaginationLabel = withBoxProps(
  defineComponent({
    name: 'PaginationLabel',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = usePaginationContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'span',
            ...ctx.getStyles('label', { className: attrs.class, style: attrs.style as any }),
          },
          () =>
            slots.default?.({ active: ctx.active, total: ctx.total }) ??
            `Page ${ctx.active} of ${ctx.total}`,
        )
    },
  }),
)
