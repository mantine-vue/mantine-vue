import { Fragment, defineComponent, h, type Component, type PropType } from 'vue'
import { camelToKebabCase, filterProps, isNumberLike } from '@mantine-vue/utils'
import { InlineStyles } from '../InlineStyles'
import { useSafeMantineTheme } from '../MantineProvider'
import {
  hashStyleProps,
  parseStyleProps,
  STYLE_PROPS_DATA,
  type MantineStyleProps,
} from './style-props'

export interface BoxProps extends MantineStyleProps {
  component?: string | Component
  __size?: string | number
  variant?: string
  size?: string | number
  hiddenFrom?: string
  visibleFrom?: string
  lightHidden?: boolean
  darkHidden?: boolean
  mod?:
    | Record<string, boolean | string | number | undefined>
    | Array<Record<string, boolean | string | number | undefined> | undefined>
}

function styleProp<Key extends keyof MantineStyleProps>() {
  return [String, Number, Object] as unknown as PropType<MantineStyleProps[Key]>
}

function isVueComponent(component: string | Component): component is Component {
  return typeof component !== 'string'
}

function modToAttributes(
  mod: BoxProps['mod'],
): Record<string, boolean | string | number | undefined> {
  const mods = Array.isArray(mod) ? mod : [mod]

  return mods.reduce<Record<string, boolean | string | number | undefined>>((acc, item) => {
    Object.entries(item ?? {}).forEach(([key, value]) => {
      if (value !== false && value !== undefined && value !== null) {
        acc[`data-${camelToKebabCase(key)}`] = value
      }
    })
    return acc
  }, {})
}

export const Box = defineComponent({
  name: 'Box',
  inheritAttrs: false,
  props: {
    component: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    __size: [String, Number],
    variant: String,
    size: [String, Number],
    hiddenFrom: String,
    visibleFrom: String,
    lightHidden: Boolean,
    darkHidden: Boolean,
    /** Margin, theme key: theme.spacing */
    m: styleProp<'m'>(),
    /** MarginBlock, theme key: theme.spacing */
    my: styleProp<'my'>(),
    /** MarginInline, theme key: theme.spacing */
    mx: styleProp<'mx'>(),
    /** MarginTop, theme key: theme.spacing */
    mt: styleProp<'mt'>(),
    /** MarginBottom, theme key: theme.spacing */
    mb: styleProp<'mb'>(),
    /** MarginInlineStart, theme key: theme.spacing */
    ms: styleProp<'ms'>(),
    /** MarginInlineEnd, theme key: theme.spacing */
    me: styleProp<'me'>(),
    /** MarginInlineStart, theme key: theme.spacing */
    mis: styleProp<'mis'>(),
    /** MarginInlineEnd, theme key: theme.spacing */
    mie: styleProp<'mie'>(),
    /** MarginLeft, theme key: theme.spacing */
    ml: styleProp<'ml'>(),
    /** MarginRight, theme key: theme.spacing */
    mr: styleProp<'mr'>(),
    /** Padding, theme key: theme.spacing */
    p: styleProp<'p'>(),
    /** PaddingBlock, theme key: theme.spacing */
    py: styleProp<'py'>(),
    /** PaddingInline, theme key: theme.spacing */
    px: styleProp<'px'>(),
    /** PaddingTop, theme key: theme.spacing */
    pt: styleProp<'pt'>(),
    /** PaddingBottom, theme key: theme.spacing */
    pb: styleProp<'pb'>(),
    /** PaddingInlineStart, theme key: theme.spacing */
    ps: styleProp<'ps'>(),
    /** PaddingInlineEnd, theme key: theme.spacing */
    pe: styleProp<'pe'>(),
    /** PaddingInlineStart, theme key: theme.spacing */
    pis: styleProp<'pis'>(),
    /** PaddingInlineEnd, theme key: theme.spacing */
    pie: styleProp<'pie'>(),
    /** PaddingLeft, theme key: theme.spacing */
    pl: styleProp<'pl'>(),
    /** PaddingRight, theme key: theme.spacing */
    pr: styleProp<'pr'>(),
    /** Border */
    bd: styleProp<'bd'>(),
    /** BorderRadius, theme key: theme.radius */
    bdrs: styleProp<'bdrs'>(),
    /** Background, theme key: theme.colors */
    bg: styleProp<'bg'>(),
    /** Color, theme key: theme.colors */
    c: styleProp<'c'>(),
    /** Opacity */
    opacity: styleProp<'opacity'>(),
    /** FontFamily */
    ff: styleProp<'ff'>(),
    /** FontSize, theme key: theme.fontSizes */
    fz: styleProp<'fz'>(),
    /** FontWeight */
    fw: styleProp<'fw'>(),
    /** LetterSpacing */
    lts: styleProp<'lts'>(),
    /** TextAlign */
    ta: styleProp<'ta'>(),
    /** LineHeight, theme key: theme.lineHeights */
    lh: styleProp<'lh'>(),
    /** FontStyle */
    fs: styleProp<'fs'>(),
    /** TextTransform */
    tt: styleProp<'tt'>(),
    /** TextDecoration */
    td: styleProp<'td'>(),
    /** Width, theme key: theme.spacing */
    w: styleProp<'w'>(),
    /** MinWidth, theme key: theme.spacing */
    miw: styleProp<'miw'>(),
    /** MaxWidth, theme key: theme.spacing */
    maw: styleProp<'maw'>(),
    /** Height, theme key: theme.spacing */
    h: styleProp<'h'>(),
    /** MinHeight, theme key: theme.spacing */
    mih: styleProp<'mih'>(),
    /** MaxHeight, theme key: theme.spacing */
    mah: styleProp<'mah'>(),
    /** BackgroundSize */
    bgsz: styleProp<'bgsz'>(),
    /** BackgroundPosition */
    bgp: styleProp<'bgp'>(),
    /** BackgroundRepeat */
    bgr: styleProp<'bgr'>(),
    /** BackgroundAttachment */
    bga: styleProp<'bga'>(),
    /** Position */
    pos: styleProp<'pos'>(),
    /** Top */
    top: styleProp<'top'>(),
    /** Left */
    left: styleProp<'left'>(),
    /** Bottom */
    bottom: styleProp<'bottom'>(),
    /** Right */
    right: styleProp<'right'>(),
    /** Inset */
    inset: styleProp<'inset'>(),
    /** Display */
    display: styleProp<'display'>(),
    /** Flex */
    flex: styleProp<'flex'>(),
    mod: [Object, Array] as PropType<BoxProps['mod']>,
  },
  setup(props, { attrs, slots }) {
    const theme = useSafeMantineTheme()

    return () => {
      const styleProps = Object.keys(STYLE_PROPS_DATA).reduce<Record<string, any>>((acc, key) => {
        acc[key] = props[key as keyof typeof props]
        return acc
      }, {})
      const parsed = parseStyleProps({ styleProps, theme: theme.value, data: STYLE_PROPS_DATA })
      const responsiveClassName = parsed.hasResponsiveStyles
        ? hashStyleProps(parsed.styles, parsed.media)
        : undefined
      const className = [
        attrs.class,
        responsiveClassName,
        {
          'mantine-light-hidden': props.lightHidden,
          'mantine-dark-hidden': props.darkHidden,
          [`mantine-hidden-from-${props.hiddenFrom}`]: props.hiddenFrom,
          [`mantine-visible-from-${props.visibleFrom}`]: props.visibleFrom,
        },
      ]

      const children = slots.default
      const node = h(
        props.component,
        {
          ...attrs,
          ...modToAttributes(props.mod),
          size: props.__size,
          class: className,
          'data-variant': (attrs as any)['data-variant'] ?? props.variant,
          'data-size':
            (attrs as any)['data-size'] ?? (isNumberLike(props.size) ? undefined : props.size),
          style: [filterProps(parsed.inlineStyles), attrs.style],
        },
        isVueComponent(props.component) && children ? { default: children } : children?.(),
      )

      if (!parsed.hasResponsiveStyles) {
        return node
      }

      return h(Fragment, null, [
        h(InlineStyles, {
          selector: `.${responsiveClassName}`,
          styles: parsed.styles,
          media: parsed.media,
        }),
        node,
      ])
    }
  },
})
