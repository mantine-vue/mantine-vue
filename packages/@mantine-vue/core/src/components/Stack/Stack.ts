import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, getSpacing, useProps, useStyles } from '../../core'
import classes from './Stack.module.css'

const defaultProps = {
  gap: 'md',
  align: 'stretch',
  justify: 'flex-start',
}

const varsResolver = createVarsResolver<any>((_, { gap, align, justify }) => ({
  root: {
    '--stack-gap': getSpacing(gap),
    '--stack-align': align,
    '--stack-justify': justify,
  },
}))

export const Stack = withBoxProps(
  defineComponent({
    name: 'Stack',
    inheritAttrs: false,
    props: {
      gap: [String, Number] as PropType<string | number>,
      align: { type: String, default: undefined },
      justify: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Stack', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Stack',
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
