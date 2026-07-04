import { defineComponent, h, ref, watch, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  useProps,
  useStyles,
} from '../../core'
import { AvatarGroup } from './AvatarGroup/AvatarGroup'
import { useAvatarGroupContext } from './AvatarGroup/AvatarGroup'
import { AvatarPlaceholderIcon } from './AvatarPlaceholderIcon'
import { getInitials } from './get-initials/get-initials'
import { getInitialsColor } from './get-initials-color/get-initials-color'
import classes from './Avatar.module.css'

export type AvatarVariant =
  | 'filled'
  | 'light'
  | 'gradient'
  | 'outline'
  | 'transparent'
  | 'default'
  | 'white'

const varsResolver = createVarsResolver<any>(
  (
    theme,
    { size, radius, variant, gradient, color, autoContrast, name, allowedInitialsColors },
  ) => {
    const resolvedColor =
      color === 'initials' && typeof name === 'string'
        ? getInitialsColor(name, allowedInitialsColors)
        : color

    const colors = theme.variantColorResolver({
      color: resolvedColor || 'gray',
      theme,
      gradient,
      variant: variant || 'light',
      autoContrast,
    })

    return {
      root: {
        '--avatar-size': getSize(size, 'avatar-size'),
        '--avatar-radius': radius === undefined ? undefined : getRadius(radius),
        '--avatar-bg': resolvedColor || variant ? colors.background : undefined,
        '--avatar-color': resolvedColor || variant ? colors.color : undefined,
        '--avatar-bd': resolvedColor || variant ? colors.border : undefined,
      },
    }
  },
)

const AvatarBase = defineComponent({
  name: 'Avatar',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'div' },
    size: [String, Number] as PropType<string | number>,
    radius: [String, Number] as PropType<string | number>,
    color: { type: String as PropType<string | 'initials'>, default: undefined },
    gradient: {
      type: Object as PropType<{ from: string; to: string; deg?: number }>,
      default: undefined,
    },
    src: { type: String as PropType<string | null>, default: undefined },
    alt: { type: String, default: undefined },
    imageProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    name: { type: String, default: undefined },
    allowedInitialsColors: { type: Array as PropType<string[]>, default: undefined },
    variant: { type: String as PropType<AvatarVariant>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Avatar', null, rawProps)
    const groupCtx = useAvatarGroupContext()
    const imageError = ref(!rawProps.src)
    const getStyles = useStyles({
      name: 'Avatar',
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

    watch(
      () => rawProps.src,
      (src) => {
        imageError.value = !src
      },
    )

    return () => {
      const src = rawProps.src
      const imageProps = rawProps.imageProps ?? {}
      const placeholder =
        slots.default?.() || (rawProps.name ? getInitials(rawProps.name) : h(AvatarPlaceholderIcon))

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('root'),
          component: props.component,
          mod: [{ withinGroup: groupCtx.withinGroup }, props.mod],
        },
        () =>
          imageError.value || !src
            ? h('span', { ...getStyles('placeholder'), title: rawProps.alt }, placeholder)
            : h('img', {
                ...imageProps,
                ...getStyles('image'),
                src,
                alt: rawProps.alt,
                onError: (event: Event) => {
                  imageError.value = true
                  imageProps.onError?.(event)
                },
              }),
      )
    }
  },
})

export const Avatar = withBoxProps(
  Object.assign(AvatarBase, {
    Group: AvatarGroup,
  }),
)
