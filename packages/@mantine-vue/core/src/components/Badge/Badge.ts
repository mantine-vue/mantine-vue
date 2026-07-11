import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  getThemeColor,
  type MantineVariant,
  useProps,
  useStyles,
} from '../../core'
import classes from './Badge.module.css'

export type BadgeVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'dot'
  | 'transparent'
  | 'white'
  | 'default'
  | 'gradient'

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, size, autoContrast, circle }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--badge-height': getSize(size, 'badge-height'),
        '--badge-padding-x': getSize(size, 'badge-padding-x'),
        '--badge-fz': getSize(size, 'badge-fz'),
        '--badge-radius': circle || radius === undefined ? undefined : getRadius(radius),
        '--badge-bg': color || variant ? colors.background : undefined,
        '--badge-color': color || variant ? colors.color : undefined,
        '--badge-bd': color || variant ? colors.border : undefined,
        '--badge-dot-color': variant === 'dot' ? getThemeColor(color, theme) : undefined,
      },
    }
  },
)

export const Badge = withBoxProps(
  defineComponent({
    name: 'Badge',
    inheritAttrs: false,
    props: {
      component: { type: String, default: 'div' },
      size: [String, Number] as PropType<string | number>,
      circle: { type: Boolean, default: false },
      radius: [String, Number] as PropType<string | number>,
      color: { type: String, default: undefined },
      gradient: {
        type: Object as PropType<{ from: string; to: string; deg?: number }>,
        default: undefined,
      },
      leftSection: { type: [String, Number, Object, Function], default: undefined },
      rightSection: { type: [String, Number, Object, Function], default: undefined },
      fullWidth: { type: Boolean, default: false },
      autoContrast: { type: Boolean, default: undefined },
      variant: { type: String as PropType<MantineVariant<BadgeVariant>>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Badge', null, rawProps)
      const getStyles = useStyles({
        name: 'Badge',
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

      const renderSection = (section: any, position: 'left' | 'right') =>
        section
          ? h(
              'span',
              {
                ...getStyles('section'),
                'data-position': position,
              },
              typeof section === 'function' ? section() : section,
            )
          : null

      return () => {
        const children = slots.default?.()
        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            component: props.component,
            variant: props.variant,
            mod: {
              block: props.fullWidth,
              circle: props.circle,
              withRightSection: Boolean(props.rightSection),
              withLeftSection: Boolean(props.leftSection),
            },
          },
          () => [
            renderSection(props.leftSection, 'left'),
            h('span', getStyles('label'), children),
            renderSection(props.rightSection, 'right'),
          ],
        )
      }
    },
  }),
)
