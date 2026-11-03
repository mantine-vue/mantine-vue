import { Fragment, defineComponent, h, shallowRef, type Component, type PropType } from 'vue'
import { assignRef, type VueRefTarget } from '@mantine-vue/hooks'
import { camelToKebabCase, isNumberLike } from '@mantine-vue/utils'
import { InlineStyles } from '../InlineStyles'
import { useSafeMantineTheme, type MantineTheme } from '../MantineProvider'
import {
  hashStyleProps,
  parseStyleProps,
  STYLE_PROPS_DATA,
  type MantineStyleProps,
} from './style-props'

/** A single set of element modifiers, transformed into `data-` attributes. Falsy values are removed. */
export type Mod = Record<string, boolean | string | number | undefined>
export type BoxMod = Mod | Array<Mod | BoxMod | undefined>

export interface BoxProps extends MantineStyleProps {
  component?: string | Component
  __size?: string | number
  variant?: string
  size?: string | number
  hiddenFrom?: string
  visibleFrom?: string
  lightHidden?: boolean
  darkHidden?: boolean
  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

function styleProp<Key extends keyof MantineStyleProps>() {
  return [String, Number, Object] as unknown as PropType<MantineStyleProps[Key]>
}

function isVueComponent(component: string | Component): component is Component {
  return typeof component !== 'string'
}

type StylePropKey = keyof MantineStyleProps

const STYLE_PROP_INDEX = new Map(
  (Object.keys(STYLE_PROPS_DATA) as StylePropKey[]).map((key, index) => [key, index]),
)
const byStylePropIndex = (a: StylePropKey, b: StylePropKey) =>
  STYLE_PROP_INDEX.get(a)! - STYLE_PROP_INDEX.get(b)!

/** Recursively flattens a (possibly nested) `BoxMod` into a single `data-*` attribute map. */
function modToAttributes(
  mod: BoxMod | undefined,
  acc: Record<string, boolean | string | number | undefined> = {},
): Record<string, boolean | string | number | undefined> {
  const mods = Array.isArray(mod) ? mod : [mod]

  mods.forEach((item) => {
    if (Array.isArray(item)) {
      modToAttributes(item, acc)
      return
    }

    Object.entries(item ?? {}).forEach(([key, value]) => {
      if (value !== false && value !== undefined && value !== null) {
        acc[`data-${camelToKebabCase(key)}`] = value
      }
    })
  })

  return acc
}

const boxProps = {
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
  rootRef: {
    type: [Object, Function] as PropType<VueRefTarget<Element>>,
    default: undefined,
  },
}

const boxRuntimeProps = Object.fromEntries(
  Object.entries(boxProps).filter(([key]) => !STYLE_PROP_INDEX.has(key as StylePropKey)),
) as Omit<typeof boxProps, StylePropKey>

interface ParsedStylePropsCache {
  theme: MantineTheme
  keys: StylePropKey[]
  values: unknown[]
  inlineStyles: Record<string, string | number> | undefined
  styles: Record<string, string | number>
  media: Record<string, Record<string, string | number>>
  responsiveClassName: string | undefined
}

function isSameStyleProps(cache: ParsedStylePropsCache, keys: StylePropKey[], values: unknown[]) {
  if (cache.keys.length !== keys.length) {
    return false
  }

  for (let index = 0; index < keys.length; index += 1) {
    if (cache.keys[index] !== keys[index] || cache.values[index] !== values[index]) {
      return false
    }
  }

  return true
}

const BoxImpl = defineComponent({
  name: 'Box',
  inheritAttrs: false,
  props: boxRuntimeProps,
  setup(props, { attrs, slots, expose }) {
    const theme = useSafeMantineTheme()
    const rootElement = shallowRef<Element | null>(null)
    let parsedCache: ParsedStylePropsCache | undefined

    expose({ rootElement })

    // Vue passes a component's public instance rather than a node when `component` is a
    // component, so `$el` is unwrapped to keep `rootRef` a DOM node in every case.
    const setRootRef = (value: unknown) => {
      const node = (value as { $el?: Element } | null)?.$el ?? (value as Element | null) ?? null
      rootElement.value = node
      assignRef(props.rootRef, node)
    }

    // Parsing only reruns when a style prop value or the theme changes. Reading the theme here
    // also makes the render track it, so theme updates still reach the element.
    const getParsedStyleProps = (keys: StylePropKey[], values: unknown[]) => {
      const currentTheme = theme.value

      if (parsedCache?.theme === currentTheme && isSameStyleProps(parsedCache, keys, values)) {
        return parsedCache
      }

      const styleProps: Record<string, unknown> = {}
      keys.forEach((key, index) => {
        styleProps[key] = values[index]
      })

      const parsed = parseStyleProps({ styleProps, theme: currentTheme, data: STYLE_PROPS_DATA })
      parsedCache = {
        theme: currentTheme,
        keys,
        values,
        inlineStyles: Object.keys(parsed.inlineStyles).length > 0 ? parsed.inlineStyles : undefined,
        styles: parsed.styles,
        media: parsed.media,
        responsiveClassName: parsed.hasResponsiveStyles
          ? hashStyleProps(parsed.styles, parsed.media)
          : undefined,
      }

      return parsedCache
    }

    return () => {
      // One pass over attrs: style props are collected, everything else goes to the element.
      const nodeProps: Record<string, any> = {}
      let styleKeys: StylePropKey[] | undefined

      for (const key in attrs) {
        if (STYLE_PROP_INDEX.has(key as StylePropKey)) {
          if (attrs[key] !== undefined) {
            ;(styleKeys ??= []).push(key as StylePropKey)
          }
        } else {
          nodeProps[key] = attrs[key]
        }
      }

      // Canonical order, so that e.g. `m` is applied before `mt` however the props were passed
      const parsed = styleKeys
        ? getParsedStyleProps(
            styleKeys.sort(byStylePropIndex),
            styleKeys.map((key) => attrs[key]),
          )
        : undefined
      const responsiveClass = parsed?.responsiveClassName
      const hasConditionalClasses =
        !!responsiveClass ||
        props.lightHidden ||
        props.darkHidden ||
        !!props.hiddenFrom ||
        !!props.visibleFrom
      const className = hasConditionalClasses
        ? [
            attrs.class,
            responsiveClass,
            props.lightHidden && 'mantine-light-hidden',
            props.darkHidden && 'mantine-dark-hidden',
            props.hiddenFrom && `mantine-hidden-from-${props.hiddenFrom}`,
            props.visibleFrom && `mantine-visible-from-${props.visibleFrom}`,
          ]
        : attrs.class
      const inlineStyles = parsed?.inlineStyles
      const style = inlineStyles
        ? attrs.style
          ? [inlineStyles, attrs.style]
          : inlineStyles
        : attrs.style

      nodeProps.size = props.__size
      nodeProps.class = className
      nodeProps['data-variant'] = (attrs as any)['data-variant'] ?? props.variant
      nodeProps['data-size'] =
        (attrs as any)['data-size'] ?? (isNumberLike(props.size) ? undefined : props.size)
      nodeProps.style = style
      nodeProps.ref = setRootRef

      if (props.mod) {
        Object.assign(nodeProps, modToAttributes(props.mod))
      }

      const children = slots.default
      const node = h(
        props.component,
        nodeProps,
        isVueComponent(props.component) && children ? { default: children } : children?.(),
      )

      if (!responsiveClass) {
        return node
      }

      return h(Fragment, null, [
        h(InlineStyles, {
          selector: `.${responsiveClass}`,
          styles: parsed!.styles,
          media: parsed!.media,
        }),
        node,
      ])
    }
  },
})

// Typing helper only (never called): gives `Box` the public type of all its props, style props
// included, while the runtime component above only registers the non-style ones.
const defineTypedBox = () => defineComponent({ name: 'Box', props: boxProps })

export const Box = BoxImpl as unknown as ReturnType<typeof defineTypedBox>
