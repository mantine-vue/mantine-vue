import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getThemeColor,
  useProps,
  useStyles,
  type MantineColor,
} from '../../core'
import classes from './Code.module.css'

const varsResolver = createVarsResolver<any>((theme, { color }) => ({
  root: {
    '--code-bg': color ? getThemeColor(color, theme) : undefined,
  },
}))

export const Code = withBoxProps(
  defineComponent({
    name: 'Code',
    inheritAttrs: false,
    props: {
      color: { type: String as PropType<MantineColor>, default: undefined },
      block: { type: Boolean, default: false },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Code', null, rawProps)
      const getStyles = useStyles({
        name: 'Code',
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
            component: props.block ? 'pre' : 'code',
            mod: { block: props.block },
            dir: 'ltr',
          },
          () => slots.default?.(),
        )
    },
  }),
)
