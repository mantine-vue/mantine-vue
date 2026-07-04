import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getGradient,
  getLineHeight,
  useProps,
  useStyles,
} from '../../core'
import classes from './Text.module.css'

type TextTruncate = 'end' | 'start' | boolean

function getTextTruncate(truncate: TextTruncate | undefined) {
  if (truncate === 'start') {
    return 'start'
  }

  if (truncate === 'end' || truncate) {
    return 'end'
  }

  return undefined
}

const defaultProps = {
  inherit: false,
}

const varsResolver = createVarsResolver<any>(
  (theme, { variant, lineClamp, gradient, size, textWrap }) => ({
    root: {
      '--text-fz': getFontSize(size),
      '--text-lh': getLineHeight(size),
      '--text-gradient': variant === 'gradient' ? getGradient(gradient, theme) : undefined,
      '--text-line-clamp': typeof lineClamp === 'number' ? lineClamp.toString() : undefined,
      '--text-text-wrap': textWrap,
    },
  }),
)

export const Text = withBoxProps(
  defineComponent({
    name: 'Text',
    inheritAttrs: false,
    props: {
      component: { type: String, default: undefined },
      __staticSelector: { type: String, default: undefined },
      size: [String, Number] as PropType<string | number>,
      lineClamp: { type: Number, default: undefined },
      truncate: { type: [String, Boolean] as PropType<TextTruncate>, default: undefined },
      inline: { type: Boolean, default: false },
      inherit: { type: Boolean, default: undefined },
      gradient: {
        type: Object as PropType<{ from: string; to: string; deg?: number }>,
        default: undefined,
      },
      span: { type: Boolean, default: false },
      textWrap: {
        type: String as PropType<'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'>,
        default: undefined,
      },
      variant: { type: String as PropType<'text' | 'gradient'>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Text', defaultProps, rawProps)
      const getStyles = useStyles({
        name: props.__staticSelector ?? 'Text',
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
            component: props.component ?? (props.span ? 'span' : 'p'),
            variant: props.variant,
            mod: [
              {
                truncate: getTextTruncate(props.truncate),
                lineClamp: typeof props.lineClamp === 'number',
                inline: props.inline,
                inherit: props.inherit,
              },
              props.mod,
            ],
          },
          () => slots.default?.(),
        )
    },
  }),
)
