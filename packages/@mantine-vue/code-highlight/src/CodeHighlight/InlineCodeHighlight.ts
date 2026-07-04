import { defineComponent, h, type PropType } from 'vue'
import {
  createVarsResolver,
  getRadius,
  getThemeColor,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { CodeHighlight } from './CodeHighlight'
import classes from '../CodeHighlight.module.css'

export type InlineCodeHighlightStylesNames = 'inlineCodeHighlight'
export type InlineCodeHighlightCssVariables = {
  inlineCodeHighlight: '--ch-background' | '--ch-radius'
}

export interface InlineCodeHighlightProps {
  code: string
  language?: string
  background?: string
  radius?: string | number
  withBorder?: boolean
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  [key: string]: any
}

export interface InlineCodeHighlightFactory {
  props: InlineCodeHighlightProps
  stylesNames: InlineCodeHighlightStylesNames
  vars: InlineCodeHighlightCssVariables
}

const varsResolver = createVarsResolver<any>((theme, { background, radius }) => ({
  inlineCodeHighlight: {
    '--ch-background': background ? getThemeColor(background, theme) : undefined,
    '--ch-radius': typeof radius !== 'undefined' ? getRadius(radius) : undefined,
  },
}))

export const InlineCodeHighlight = defineComponent({
  name: 'InlineCodeHighlight',
  inheritAttrs: false,
  props: {
    code: { type: String, required: true },
    language: { type: String, default: undefined },
    background: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    withBorder: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<InlineCodeHighlightProps>('InlineCodeHighlight', null, rawProps as any)
    const getStyles = useStyles<InlineCodeHighlightFactory>({
      name: 'InlineCodeHighlight',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
      rootSelector: 'inlineCodeHighlight',
    } as any)

    return () =>
      h(CodeHighlight, {
        ...attrs,
        ...props,
        ...getStyles('inlineCodeHighlight'),
        __inline: true,
      })
  },
})

Object.assign(InlineCodeHighlight, { classes, varsResolver })
