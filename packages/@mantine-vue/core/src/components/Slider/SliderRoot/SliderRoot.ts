import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useSliderContext } from '../Slider.context'
export const SliderRoot = withBoxProps(
  defineComponent({
    name: 'SliderRoot',
    inheritAttrs: false,
    props: {
      size: { type: [String, Number] as PropType<string | number>, required: true },
      disabled: { type: Boolean, default: false },
      variant: { type: String, default: undefined },
      orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    },
    setup(props, { attrs, slots }) {
      const ctx = useSliderContext()
      return () =>
        h(
          Box,
          {
            ...attrs,
            tabindex: -1,
            variant: props.variant,
            ...ctx.getStyles('root', { className: attrs.class, style: attrs.style }),
            mod: { orientation: props.orientation },
          },
          () => slots.default?.(),
        )
    },
  }),
)
