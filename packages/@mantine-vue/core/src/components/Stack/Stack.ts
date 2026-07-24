import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  useProps,
  useStyles,
  type AlignItems,
  type JustifyContent,
  type MantineSpacing,
} from '../../core'
import classes from './Stack.module.css'

const defaultProps = {
  gap: 'md',
  align: 'stretch',
  justify: 'flex-start',
} as const

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
      gap: [String, Number] as PropType<MantineSpacing>,
      align: { type: String as PropType<AlignItems>, default: undefined },
      justify: { type: String as PropType<JustifyContent>, default: undefined },
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
