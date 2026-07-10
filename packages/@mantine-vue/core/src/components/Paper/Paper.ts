import { defineComponent, h, ref, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getShadow,
  useForwardedRef,
  useProps,
  useStyles,
} from '../../core'
import classes from './Paper.module.css'

const varsResolver = createVarsResolver<any>((_, { radius, shadow }) => ({
  root: {
    '--paper-radius': radius === undefined ? undefined : getRadius(radius),
    '--paper-shadow': getShadow(shadow),
  },
}))

export const Paper = withBoxProps(
  defineComponent({
    name: 'Paper',
    inheritAttrs: false,
    props: {
      component: { type: String, default: 'div' },
      shadow: { type: String, default: undefined },
      radius: [String, Number] as PropType<string | number>,
      withBorder: { type: Boolean, default: false },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Paper', null, rawProps)
      const getStyles = useStyles({
        name: 'Paper',
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
      const elementRef = ref<HTMLElement | null>(null)
      useForwardedRef(elementRef)

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            component: props.component,
            mod: { 'with-border': props.withBorder },
            ref: elementRef,
          },
          () => slots.default?.(),
        )
    },
  }),
)
