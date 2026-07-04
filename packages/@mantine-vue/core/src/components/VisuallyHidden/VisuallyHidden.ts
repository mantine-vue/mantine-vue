import { defineComponent, h } from 'vue'
import { withBoxProps, Box, useProps, useStyles } from '../../core'
import classes from './VisuallyHidden.module.css'

export type VisuallyHiddenStylesNames = 'root'

export const VisuallyHidden = withBoxProps(
  defineComponent({
    name: 'VisuallyHidden',
    inheritAttrs: false,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('VisuallyHidden', null, rawProps)
      const getStyles = useStyles({
        name: 'VisuallyHidden',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        unstyled: props.unstyled,
      })

      return () =>
        h(Box, { component: 'span', ...attrs, ...getStyles('root') }, () => slots.default?.())
    },
  }),
)
