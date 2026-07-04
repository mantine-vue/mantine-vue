import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, getSize, useProps, useStyles } from '../../core'
import classes from './Container.module.css'

const defaultProps = {
  strategy: 'block',
} as const

const varsResolver = createVarsResolver<any>((_, { size, fluid }) => ({
  root: {
    '--container-size': fluid ? undefined : getSize(size, 'container-size'),
  },
}))

export const Container = withBoxProps(
  defineComponent({
    name: 'Container',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<string | number>,
      fluid: { type: Boolean, default: false },
      strategy: { type: String as PropType<'block' | 'grid'>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Container', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Container',
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
            mod: { fluid: props.fluid, strategy: props.strategy },
          },
          () => slots.default?.(),
        )
    },
  }),
)
