import { defineComponent, h } from 'vue'
import { withBoxProps, Box, useProps, useStyles } from '../../core'
import classes from './Center.module.css'

export const Center = withBoxProps(
  defineComponent({
    name: 'Center',
    inheritAttrs: false,
    props: {
      component: { type: String, default: 'div' },
      inline: { type: Boolean, default: false },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Center', null, rawProps)
      const getStyles = useStyles({
        name: 'Center',
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
        h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            component: props.component,
            mod: { inline: props.inline },
          },
          () => slots.default?.(),
        )
    },
  }),
)
