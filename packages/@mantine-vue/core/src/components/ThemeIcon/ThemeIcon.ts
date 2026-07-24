import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  type MantineColor,
  type MantineGradient,
  type MantineRadius,
  type MantineSize,
  type MantineVariant,
  useProps,
  useStyles,
} from '../../core'
import classes from './ThemeIcon.module.css'

export type ThemeIconVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'default'
  | 'gradient'

const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, variant, gradient, color, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--ti-size': getSize(size, 'ti-size'),
        '--ti-radius': radius === undefined ? undefined : getRadius(radius),
        '--ti-bg': color || variant ? colors.background : undefined,
        '--ti-color': color || variant ? colors.color : undefined,
        '--ti-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)

export const ThemeIcon = withBoxProps(
  defineComponent({
    name: 'ThemeIcon',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<MantineSize | (string & {}) | number>,
      color: { type: String as PropType<MantineColor>, default: undefined },
      radius: [String, Number] as PropType<MantineRadius>,
      gradient: {
        type: Object as PropType<MantineGradient>,
        default: undefined,
      },
      autoContrast: { type: Boolean, default: undefined },
      variant: { type: String as PropType<MantineVariant<ThemeIconVariant>>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ThemeIcon', null, rawProps)
      const getStyles = useStyles({
        name: 'ThemeIcon',
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
            variant: props.variant,
          },
          () => slots.default?.(),
        )
    },
  }),
)
