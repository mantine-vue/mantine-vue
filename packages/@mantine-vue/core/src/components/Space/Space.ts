import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, useProps } from '../../core'

export const Space = withBoxProps(
  defineComponent({
    name: 'Space',
    inheritAttrs: false,
    props: {
      w: [String, Number] as PropType<string | number>,
      h: [String, Number] as PropType<string | number>,
      miw: [String, Number] as PropType<string | number>,
      mih: [String, Number] as PropType<string | number>,
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Space', null, rawProps)

      return () =>
        h(
          Box,
          {
            ...attrs,
            w: props.w,
            h: props.h,
            miw: props.miw ?? props.w,
            mih: props.mih ?? props.h,
          },
          () => slots.default?.(),
        )
    },
  }),
)
