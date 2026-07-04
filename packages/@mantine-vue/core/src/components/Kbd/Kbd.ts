import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, getSize, useProps, useStyles } from '../../core'
import classes from './Kbd.module.css'

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: { '--kbd-fz': getSize(size, 'kbd-fz') },
}))

export const Kbd = withBoxProps(
  defineComponent({
    name: 'Kbd',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<string | number>,
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Kbd', null, rawProps)
      const getStyles = useStyles({
        name: 'Kbd',
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
        h(Box, { ...attrs, ...getStyles('root'), component: 'kbd' }, () => slots.default?.())
    },
  }),
)
