import { defineComponent, h } from 'vue'
import { withBoxProps, Box, createVarsResolver, useProps, useStyles } from '../../core'
import { getMarkColor } from './get-mark-color'
import classes from './Mark.module.css'

const defaultProps = {
  color: 'yellow',
}

const varsResolver = createVarsResolver<any>((theme, { color }) => ({
  root: {
    '--mark-bg-dark': getMarkColor({ color, theme, defaultShade: 5 }),
    '--mark-bg-light': getMarkColor({ color, theme, defaultShade: 2 }),
  },
}))

export const Mark = withBoxProps(
  defineComponent({
    name: 'Mark',
    inheritAttrs: false,
    props: {
      color: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Mark', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Mark',
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
        h(Box, { ...attrs, ...getStyles('root'), component: 'mark' }, () => slots.default?.())
    },
  }),
)
