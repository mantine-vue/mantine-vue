import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getThemeColor,
  parseThemeColor,
  rem,
  rgba,
  useProps,
  useStyles,
} from '../../core'
import classes from './Blockquote.module.css'

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

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

export const Blockquote = withBoxProps(
  defineComponent({
    name: 'Blockquote',
    inheritAttrs: false,
    props: {
      icon: { type: [String, Number, Object, Function], default: undefined },
      iconSize: [String, Number] as PropType<string | number>,
      color: { type: String, default: undefined },
      radius: [String, Number] as PropType<string | number>,
      cite: { type: [String, Number, Object, Function], default: undefined },
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
        const icon = props.icon ?? slots.icon?.()
        const cite = props.cite ?? slots.cite?.()

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            component: 'blockquote',
          },
          () => [
            icon ? h('span', getStyles('icon'), renderContent(icon)) : null,
            slots.default?.(),
            cite ? h('cite', getStyles('cite'), renderContent(cite)) : null,
          ],
        )
      }
    },
  }),
)
