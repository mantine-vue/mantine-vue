import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getThemeColor,
  hasNode,
  parseThemeColor,
  rem,
  resolveNode,
  rgba,
  type MantineColor,
  type MantineNode,
  type MantineRadius,
  useProps,
  useStyles,
} from '../../core'
import classes from './Blockquote.module.css'

export interface BlockquoteSlots {
  default?: () => VNodeChild
  icon?: () => VNodeChild
  cite?: () => VNodeChild
}

const defaultProps = {
  iconSize: 48,
}

const varsResolver = createVarsResolver<any>((theme, { color, iconSize, radius, textWrap }) => {
  const darkParsed = parseThemeColor({
    color: color || theme.primaryColor,
    theme,
    colorScheme: 'dark',
  })

  const lightParsed = parseThemeColor({
    color: color || theme.primaryColor,
    theme,
    colorScheme: 'light',
  })

  return {
    root: {
      '--bq-bg-light': rgba(lightParsed.value, 0.07),
      '--bq-bg-dark': rgba(darkParsed.value, 0.06),
      '--bq-bd': getThemeColor(color, theme),
      '--bq-icon-size': rem(iconSize),
      '--bq-radius': getRadius(radius),
      '--bq-text-wrap': textWrap,
    },
  }
})

export const Blockquote = withBoxProps(
  defineComponent({
    name: 'Blockquote',
    inheritAttrs: false,
    slots: Object as SlotsType<BlockquoteSlots>,
    props: {
      icon: { type: null as unknown as PropType<MantineNode>, default: undefined },
      iconSize: [String, Number] as PropType<string | number>,
      color: { type: String as PropType<MantineColor>, default: undefined },
      radius: [String, Number] as PropType<MantineRadius>,
      cite: { type: null as unknown as PropType<MantineNode>, default: undefined },
      textWrap: {
        type: String as PropType<'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'>,
        default: undefined,
      },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Blockquote', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Blockquote',
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

      return () => {
        const icon = resolveNode(props.icon, slots.icon)
        const cite = resolveNode(props.cite, slots.cite)

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            component: 'blockquote',
          },
          () => [
            hasNode(icon) ? h('span', getStyles('icon'), icon as any) : null,
            slots.default?.(),
            hasNode(cite) ? h('cite', getStyles('cite'), cite as any) : null,
          ],
        )
      }
    },
  }),
)
