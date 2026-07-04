import { withBoxProps } from '../../../core'
import { defineComponent, h, type PropType } from 'vue'
import { UnstyledButton } from '../../UnstyledButton'
import { usePaginationContext } from '../Pagination.context'

export const PaginationControl = withBoxProps(
  defineComponent({
    name: 'PaginationControl',
    inheritAttrs: false,
    props: {
      active: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      withPadding: { type: Boolean, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      className: { type: null as any, default: undefined },
      class: { type: null as any, default: undefined },
      style: { type: null as any, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = rawProps
      const ctx = usePaginationContext()

      return () => {
        const disabled = props.disabled || ctx.disabled
        const withPadding = props.withPadding ?? true

        return h(
          UnstyledButton,
          {
            ...attrs,
            disabled,
            'aria-disabled': disabled || undefined,
            'aria-current': props.active ? 'page' : attrs['aria-current'],
            unstyled: (attrs as any).unstyled,
            __staticSelector: 'Pagination',
            ...ctx.getStyles('control', {
              className: props.className ?? props.class ?? attrs.class,
              style: props.style ?? attrs.style,
            }),
            mod: [{ active: props.active, disabled, withPadding }, props.mod],
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)
