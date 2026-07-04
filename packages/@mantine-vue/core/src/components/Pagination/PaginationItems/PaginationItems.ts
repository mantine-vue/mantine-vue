import { defineComponent, h } from 'vue'
import { DOTS } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { PaginationDots } from '../PaginationDots/PaginationDots'
import { PaginationControl } from '../PaginationControl/PaginationControl'
import { usePaginationContext } from '../Pagination.context'

export const PaginationItems = defineComponent({
  name: 'PaginationItems',
  setup() {
    const ctx = usePaginationContext()

    return () =>
      ctx.range.map((page, index) => {
        if (page === DOTS) {
          return h(PaginationDots, { key: `dots-${index}` })
        }

        const itemProps = ctx.getItemProps?.(page) ?? {}
        const { children, onClick, ...others } = itemProps

        return h(
          PaginationControl,
          {
            key: page,
            active: page === ctx.active,
            disabled: ctx.disabled,
            'aria-label': others['aria-label'] ?? `${page}`,
            'aria-current': page === ctx.active ? 'page' : undefined,
            ...others,
            onClick: (event: MouseEvent) => {
              onClick?.(event)
              ctx.onChange(page)
            },
          },
          () => children ?? page,
        )
      })
  },
})

export const PaginationItemsGroup = defineComponent({
  name: 'PaginationItemsGroup',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const ctx = usePaginationContext()

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...ctx.getStyles('items', { className: attrs.class, style: attrs.style as any }),
        },
        () => h(PaginationItems),
      )
  },
})
