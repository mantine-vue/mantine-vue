import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { useProgressContext } from '../Progress.context'
import classes from '../Progress.module.css'

export const ProgressLabel = withBoxProps(
  defineComponent({
    name: 'ProgressLabel',
    inheritAttrs: false,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      className: { type: [String, Array, Object] as PropType<any>, default: undefined },
      style: { type: [String, Array, Object] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ProgressLabel', null, rawProps)
      const ctx = useProgressContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('label', {
              className: [props.className, attrs.class],
              style: [props.style, attrs.style],
              props,
            }),
          },
          () => slots.default?.(),
        )
    },
  }),
)

Object.assign(ProgressLabel, { classes })
