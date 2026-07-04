import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  rem,
  useProps,
  useStyles,
} from '../../core'
import classes from './ColorSwatch.module.css'

const defaultProps = {
  withShadow: true,
}

const varsResolver = createVarsResolver<any>((_, { radius, size }) => ({
  root: {
    '--cs-radius': radius === undefined ? undefined : getRadius(radius),
    '--cs-size': rem(size),
  },
}))

export const ColorSwatch = withBoxProps(
  defineComponent({
    name: 'ColorSwatch',
    inheritAttrs: false,
    props: {
      color: { type: String, required: true },
      size: [String, Number] as PropType<string | number>,
      radius: [String, Number] as PropType<string | number>,
      withShadow: { type: Boolean, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ColorSwatch', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'ColorSwatch',
        props,
        classes,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        varsResolver,
        unstyled: props.unstyled,
      })

      return () =>
        h(Box, { ...attrs, ...getStyles('root') }, () => [
          h('span', getStyles('alphaOverlay')),
          props.withShadow ? h('span', getStyles('shadowOverlay')) : null,
          h('span', getStyles('colorOverlay', { style: { backgroundColor: props.color } })),
          h('span', getStyles('childrenOverlay'), slots.default?.()),
        ])
    },
  }),
)
