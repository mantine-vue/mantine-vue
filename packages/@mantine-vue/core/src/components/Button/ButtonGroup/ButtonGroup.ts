import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, rem, useProps, useStyles } from '../../../core'
import classes from '../Button.module.css'

const defaultProps = {
  orientation: 'horizontal',
} as const

const varsResolver = createVarsResolver<any>((_, { borderWidth }) => ({
  group: { '--button-border-width': rem(borderWidth) },
}))

export const ButtonGroup = withBoxProps(
  defineComponent({
    name: 'ButtonGroup',
    inheritAttrs: false,
    props: {
      orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
      borderWidth: [String, Number] as PropType<string | number>,
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ButtonGroup', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'ButtonGroup',
        props,
        classes,
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
            ...getStyles('group'),
            role: 'group',
            mod: { orientation: props.orientation },
          },
          () => slots.default?.(),
        )
    },
  }),
)
