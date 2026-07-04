import { withBoxProps } from '../../../core'
import { defineComponent, h, type PropType } from 'vue'
import { CloseButton } from '../../CloseButton'
import { useInputContext } from '../Input.context'

export const InputClearButton = withBoxProps(
  defineComponent({
    name: 'InputClearButton',
    inheritAttrs: false,
    props: {
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      variant: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const ctx = useInputContext()

      return () =>
        h(
          CloseButton as any,
          {
            ...attrs,
            variant: props.variant || 'transparent',
            size: props.size || ctx.size || 'sm',
            classNames: props.classNames,
            styles: props.styles,
            __staticSelector: 'InputClearButton',
            style: [{ pointerEvents: 'all', background: 'var(--input-bg)' }, attrs.style as any],
          } as any,
          () => slots.default?.(),
        )
    },
  }),
)
