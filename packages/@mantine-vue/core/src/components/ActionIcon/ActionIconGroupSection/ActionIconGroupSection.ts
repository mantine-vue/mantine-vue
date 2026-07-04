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
} from '../../../core'
import classes from '../ActionIcon.module.css'
import type { ActionIconVariant } from '../ActionIcon'

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, autoContrast, size }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      groupSection: {
        '--section-height': getSize(size, 'section-height'),
        '--section-padding-x': getSize(size, 'section-padding-x'),
        '--section-fz': getFontSize(size),
        '--section-radius': radius === undefined ? undefined : getRadius(radius),
        '--section-bg': color || variant ? colors.background : undefined,
        '--section-color': colors.color,
        '--section-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)

export const ActionIconGroupSection = withBoxProps(
  defineComponent({
    name: 'ActionIconGroupSection',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<string | number>,
      color: { type: String, default: undefined },
      radius: [String, Number] as PropType<string | number>,
      gradient: {
        type: Object as PropType<{ from: string; to: string; deg?: number }>,
        default: undefined,
      },
      autoContrast: { type: Boolean, default: undefined },
      variant: { type: String as PropType<ActionIconVariant>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ActionIconGroupSection', null, rawProps)
      const getStyles = useStyles({
        name: 'ActionIconGroupSection',
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
