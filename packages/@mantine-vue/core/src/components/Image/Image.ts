import { defineComponent, h, ref, watch, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  useProps,
  useStyles,
  type MantineRadius,
  type ObjectFit,
} from '../../core'
import classes from './Image.module.css'

const varsResolver = createVarsResolver<any>((_, { radius, fit }) => ({
  root: {
    '--image-radius': radius === undefined ? undefined : getRadius(radius),
    '--image-object-fit': fit,
  },
}))

export const Image = withBoxProps(
  defineComponent({
    name: 'Image',
    inheritAttrs: false,
    props: {
      src: { type: [String, Object] as PropType<any>, default: undefined },
      fallbackSrc: { type: String, default: undefined },
      radius: [String, Number] as PropType<MantineRadius>,
      fit: { type: String as PropType<ObjectFit>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    emits: ['error'],
    setup(rawProps, { attrs, emit }) {
      const props = useProps('Image', null, rawProps)
      const error = ref(!props.src)
      const getStyles = useStyles({
        name: 'Image',
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

      watch(
        () => props.src,
        (src) => {
          error.value = !src
        },
      )

      return () => {
        const useFallback = error.value && props.fallbackSrc

        return h(Box, {
          ...attrs,
          ...getStyles('root'),
          component: 'img',
          src: useFallback ? props.fallbackSrc : props.src,
          mod: { fallback: Boolean(useFallback) },
          onError: (event: Event) => {
            emit('error', event)
            error.value = true
          },
        })
      }
    },
  }),
)
