import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  PaginationFirstIcon,
  PaginationLastIcon,
  PaginationNextIcon,
  PaginationPreviousIcon,
} from '../Pagination.icons'
import { usePaginationContext } from '../Pagination.context'
import { PaginationControl } from '../PaginationControl/PaginationControl'
import { withBoxProps } from '../../../core'

export interface PaginationEdgeSlots {
  icon?: () => VNodeChild
}

function createEdge(
  name: string,
  icon: any,
  label: string,
  getDisabled: (ctx: any) => boolean,
  getAction: (ctx: any) => () => void,
) {
  return defineComponent({
    name,
    inheritAttrs: false,
    slots: Object as SlotsType<PaginationEdgeSlots>,
    props: {
      icon: { type: [Object, Function] as PropType<any>, default: undefined },
      disabled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const ctx = usePaginationContext()

      return () => {
        const Icon = props.icon ?? icon
        const disabled = props.disabled || ctx.disabled || getDisabled(ctx)

        return h(
          PaginationControl,
          {
            ...attrs,
            disabled,
            withPadding: false,
            'aria-label': attrs['aria-label'] ?? label,
            onClick: disabled ? undefined : getAction(ctx),
          },
          () => (slots.icon ? slots.icon() : h(Icon, { class: 'mantine-rotate-rtl' })),
        )
      }
    },
  })
}

export const PaginationNext = withBoxProps(
  createEdge(
    'PaginationNext',
    PaginationNextIcon,
    'Next page',
    (ctx) => ctx.active >= ctx.total,
    (ctx) => ctx.onNext,
  ),
)

export const PaginationPrevious = withBoxProps(
  createEdge(
    'PaginationPrevious',
    PaginationPreviousIcon,
    'Previous page',
    (ctx) => ctx.active <= 1,
    (ctx) => ctx.onPrevious,
  ),
)

export const PaginationFirst = withBoxProps(
  createEdge(
    'PaginationFirst',
    PaginationFirstIcon,
    'First page',
    (ctx) => ctx.active <= 1,
    (ctx) => ctx.onFirst,
  ),
)

export const PaginationLast = withBoxProps(
  createEdge(
    'PaginationLast',
    PaginationLastIcon,
    'Last page',
    (ctx) => ctx.active >= ctx.total,
    (ctx) => ctx.onLast,
  ),
)
