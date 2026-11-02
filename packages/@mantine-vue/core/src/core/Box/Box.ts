import {
  Fragment,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  ref,
  shallowRef,
  type Component,
  type PropType,
} from 'vue'
import { assignRef, type VueRefTarget } from '@mantine-vue/hooks'
import { camelToKebabCase, isNumberLike } from '@mantine-vue/utils'
import { InlineStyles } from '../InlineStyles'
import { useSafeMantineTheme } from '../MantineProvider'
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

const STYLE_PROP_KEYS = Object.keys(STYLE_PROPS_DATA) as Array<keyof MantineStyleProps>
const STYLE_PROP_INDEX = new Map(STYLE_PROP_KEYS.map((key, index) => [key, index]))
const EMPTY_STYLE_PROP_KEYS: Array<keyof MantineStyleProps> = []
const EMPTY_PARSED_STYLE_PROPS = {
  inlineStyles: {} as Record<string, string | number>,
  styles: {} as Record<string, string | number>,
  media: {} as Record<string, Record<string, string | number>>,
  hasResponsiveStyles: false,
}

function getSuppliedStylePropKeys(rawProps: Record<string, any> | null | undefined) {
  if (!rawProps) {
    return EMPTY_STYLE_PROP_KEYS
  }

  let keys: Array<keyof MantineStyleProps> | undefined
  for (const key of Object.keys(rawProps)) {
    if (STYLE_PROP_INDEX.has(key as keyof MantineStyleProps)) {
      keys ??= []
      keys.push(key as keyof MantineStyleProps)
    }
  }

  keys?.sort((a, b) => STYLE_PROP_INDEX.get(a)! - STYLE_PROP_INDEX.get(b)!)
  return keys ?? EMPTY_STYLE_PROP_KEYS
}

function sameStylePropKeys(
  left: Array<keyof MantineStyleProps>,
  right: Array<keyof MantineStyleProps>,
) {
  return left.length === right.length && left.every((key, index) => key === right[index])
}

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
    rootRef: {
      type: [Object, Function] as PropType<VueRefTarget<Element>>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots, expose }) {
    const theme = useSafeMantineTheme()
    const instance = getCurrentInstance()
    let rawPropsSource = instance?.vnode.props
    const suppliedStylePropKeys = shallowRef(getSuppliedStylePropKeys(rawPropsSource))

    const syncSuppliedStylePropKeys = () => {
      const nextRawPropsSource = instance?.vnode.props
      if (nextRawPropsSource === rawPropsSource) {
        return
      }

      rawPropsSource = nextRawPropsSource
      const nextKeys = getSuppliedStylePropKeys(nextRawPropsSource)
      if (!sameStylePropKeys(suppliedStylePropKeys.value, nextKeys)) {
        suppliedStylePropKeys.value = nextKeys
      }
    }

    const parsedStyleProps = computed(() => {
      let styleProps: Record<string, any> | undefined

      for (const key of suppliedStylePropKeys.value) {
        const value = props[key as keyof typeof props]
        if (value !== undefined) {
          styleProps ??= {}
          styleProps[key] = value
        }
      }

      return styleProps
        ? parseStyleProps({ styleProps, theme: theme.value, data: STYLE_PROPS_DATA })
        : EMPTY_PARSED_STYLE_PROPS
    })
    const inlineStyleProps = computed(() => {
      const styles = parsedStyleProps.value.inlineStyles
      return Object.keys(styles).length > 0 ? styles : undefined
    })
    const responsiveClassName = computed(() => {
      const parsed = parsedStyleProps.value
      return parsed.hasResponsiveStyles ? hashStyleProps(parsed.styles, parsed.media) : undefined
    })
    const rootElement = ref<Element | null>(null)

    expose({ rootElement })

    // Vue passes a component's public instance rather than a node when `component` is a
    // component, so `$el` is unwrapped to keep `rootRef` a DOM node in every case.
    const setRootRef = (value: unknown) => {
      const node = (value as { $el?: Element } | null)?.$el ?? (value as Element | null) ?? null
      rootElement.value = node
      assignRef(props.rootRef, node)
    }

    return () => {
      syncSuppliedStylePropKeys()
      const parsed = parsedStyleProps.value
      const responsiveClass = responsiveClassName.value
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
      const inlineStyles = inlineStyleProps.value
      const style = inlineStyles
        ? attrs.style
          ? [inlineStyles, attrs.style]
          : inlineStyles
        : attrs.style
      const nodeProps: Record<string, any> = {
        ...attrs,
        size: props.__size,
        class: className,
        'data-variant': (attrs as any)['data-variant'] ?? props.variant,
        'data-size':
          (attrs as any)['data-size'] ?? (isNumberLike(props.size) ? undefined : props.size),
        style,
        ref: setRootRef,
      }

      if (props.mod) {
        Object.assign(nodeProps, modToAttributes(props.mod))
      }

      const children = slots.default
      const node = h(
        props.component,
        nodeProps,
        isVueComponent(props.component) && children ? { default: children } : children?.(),
      )

      if (!parsed.hasResponsiveStyles) {
        return node
      }

      return h(Fragment, null, [
        h(InlineStyles, {
          selector: `.${responsiveClass}`,
          styles: parsed.styles,
          media: parsed.media,
        }),
        node,
      ])
    }
  },
})
