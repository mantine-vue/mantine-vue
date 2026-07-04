import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, getRadius, useProps, useStyles } from '../../core'
import classes from './BackgroundImage.module.css'

const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  root: { '--bi-radius': radius === undefined ? undefined : getRadius(radius) },
}))

export const BackgroundImage = withBoxProps(
  defineComponent({
    name: 'BackgroundImage',
    inheritAttrs: false,
    props: {
      src: { type: String, required: true },
      radius: [String, Number] as PropType<string | number>,
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('BackgroundImage', null, rawProps)
      const getStyles = useStyles({
        name: 'BackgroundImage',
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
            ...getStyles('root', { style: { backgroundImage: `url(${props.src})` } }),
          },
          () => slots.default?.(),
        )
    },
  }),
)
