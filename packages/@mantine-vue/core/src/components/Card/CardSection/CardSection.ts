import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useCardContext } from '../Card.context'

export const CardSection = withBoxProps(
  defineComponent({
    name: 'CardSection',
    inheritAttrs: false,
    props: {
      component: { type: String, default: 'div' },
      withBorder: { type: Boolean, default: false },
      inheritPadding: { type: Boolean, default: false },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('CardSection', null, rawProps)
      const ctx = useCardContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('section', { className: attrs.class, style: attrs.style as any }),
            component: props.component,
            mod: [
              {
                withBorder: props.withBorder,
                inheritPadding: props.inheritPadding,
              },
              props.mod,
            ],
          },
          () => slots.default?.(),
        )
    },
  }),
)
