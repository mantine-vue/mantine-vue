import { defineComponent, h } from 'vue'
import { withBoxProps, Box, createVarsResolver, useProps, useStyles } from '../../core'
import classes from './AspectRatio.module.css'

const varsResolver = createVarsResolver<any>((_, { ratio }) => ({
  root: {
    '--ar-ratio': ratio?.toString(),
  },
}))

export const AspectRatio = withBoxProps(
  defineComponent({
    name: 'AspectRatio',
    inheritAttrs: false,
    props: {
      ratio: { type: Number, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('AspectRatio', null, rawProps)
      const getStyles = useStyles({
        name: 'AspectRatio',
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

      return () => h(Box, { ...attrs, ...getStyles('root') }, () => slots.default?.())
    },
  }),
)
