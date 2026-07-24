import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getDefaultZIndex,
  getRadius,
  rem,
  rgba,
  useProps,
  useStyles,
  type MantineRadius,
} from '../../core'
import classes from './Overlay.module.css'

const defaultProps = {
  zIndex: getDefaultZIndex('modal'),
}

const varsResolver = createVarsResolver<any>(
  (_, { gradient, color, backgroundOpacity, blur, radius, zIndex }) => ({
    root: {
      '--overlay-bg':
        gradient ||
        ((color !== undefined || backgroundOpacity !== undefined) &&
          rgba(color || '#000', backgroundOpacity ?? 0.6)) ||
        undefined,
      '--overlay-filter': blur ? `blur(${rem(blur)})` : undefined,
      '--overlay-radius': radius === undefined ? undefined : getRadius(radius),
      '--overlay-z-index': zIndex?.toString(),
    },
  }),
)

export const Overlay = withBoxProps(
  defineComponent({
    name: 'Overlay',
    inheritAttrs: false,
    props: {
      component: { type: String, default: 'div' },
      backgroundOpacity: { type: Number, default: undefined },
      color: { type: String, default: undefined },
      blur: [String, Number] as PropType<string | number>,
      gradient: { type: String, default: undefined },
      zIndex: [String, Number] as PropType<string | number>,
      radius: [String, Number] as PropType<MantineRadius>,
      center: { type: Boolean, default: false },
      fixed: { type: Boolean, default: false },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Overlay', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Overlay',
        classes,
        props,
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
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            component: props.component,
            mod: { center: props.center, fixed: props.fixed },
          },
          () => slots.default?.(),
        )
    },
  }),
)
