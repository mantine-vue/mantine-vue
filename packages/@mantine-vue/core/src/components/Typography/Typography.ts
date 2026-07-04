import { defineComponent, h } from 'vue'
import { withBoxProps, Box, useProps, useStyles } from '../../core'
import classes from './Typography.module.css'

export type TypographyStylesNames = 'root'

export const Typography = withBoxProps(
  defineComponent({
    name: 'Typography',
    inheritAttrs: false,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Typography', null, rawProps)
      const getStyles = useStyles({
        name: 'Typography',
        props,
        classes,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
      })

      return () => h(Box, { ...attrs, ...getStyles('root') }, () => slots.default?.())
    },
  }),
)

Object.assign(Typography, { classes })
