import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getRadius,
  getSize,
  useProps,
  useStyles,
  type MantineColor,
  type MantineGradient,
  type MantineRadius,
} from '../../../core'
import classes from '../Button.module.css'
import type { ButtonSize, ButtonVariant } from '../Button'

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, autoContrast, size }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    const compactSize =
      typeof size === 'string' && size.includes('compact-') ? size.replace('compact-', '') : size

    return {
      groupSection: {
        '--section-height': getSize(size, 'section-height'),
        '--section-padding-x': getSize(size, 'section-padding-x'),
        '--section-fz': getFontSize(compactSize),
        '--section-radius': radius === undefined ? undefined : getRadius(radius),
        '--section-bg': color || variant ? colors.background : undefined,
        '--section-color': colors.color,
        '--section-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)

export const ButtonGroupSection = withBoxProps(
  defineComponent({
    name: 'ButtonGroupSection',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<ButtonSize>,
      color: { type: String as PropType<MantineColor>, default: undefined },
      radius: [String, Number] as PropType<MantineRadius>,
      gradient: {
        type: Object as PropType<MantineGradient>,
        default: undefined,
      },
      autoContrast: { type: Boolean, default: undefined },
      variant: { type: String as PropType<ButtonVariant>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ButtonGroupSection', null, rawProps)
      const getStyles = useStyles({
        name: 'ButtonGroupSection',
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
            ...getStyles('groupSection'),
            variant: props.variant,
          },
          () => slots.default?.(),
        )
    },
  }),
)
