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
import classes from './Skeleton.module.css'

const defaultProps = {
  visible: true,
  animate: true,
}

const varsResolver = createVarsResolver<any>((_, { width, height, radius, circle }) => ({
  root: {
    '--skeleton-height': rem(height),
    '--skeleton-width': circle ? rem(height) : rem(width),
    '--skeleton-radius': circle ? '1000px' : radius === undefined ? undefined : getRadius(radius),
  },
}))

export const Skeleton = withBoxProps(
  defineComponent({
    name: 'Skeleton',
    inheritAttrs: false,
    props: {
      visible: { type: Boolean, default: undefined },
      height: [String, Number] as PropType<string | number>,
      width: [String, Number] as PropType<string | number>,
      circle: { type: Boolean, default: false },
      radius: [String, Number] as PropType<string | number>,
      animate: { type: Boolean, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Skeleton', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Skeleton',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        varsResolver,
        unstyled: props.unstyled,
      })

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            mod: { visible: props.visible, animate: props.animate },
          },
          () => slots.default?.(),
        )
    },
  }),
)
