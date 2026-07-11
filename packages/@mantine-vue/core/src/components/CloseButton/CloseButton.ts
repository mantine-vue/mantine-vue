import { defineComponent, h, type PropType } from 'vue'
import { createVarsResolver, getRadius, getSize, rem, useProps, useStyles } from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import { CloseIcon } from './CloseIcon'
import classes from './CloseButton.module.css'

export type CloseButtonVariant = 'subtle' | 'transparent'

const defaultProps = {
  variant: 'subtle',
} as const

const varsResolver = createVarsResolver<any>((_, { size, radius, iconSize }) => ({
  root: {
    '--cb-size': getSize(size, 'cb-size'),
    '--cb-radius': radius === undefined ? undefined : getRadius(radius),
    '--cb-icon-size': rem(iconSize),
  },
}))

export const CloseButton = defineComponent({
  name: 'CloseButton',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'button' },
    size: [String, Number] as PropType<string | number>,
    radius: [String, Number] as PropType<string | number>,
    disabled: { type: Boolean, default: false },
    iconSize: [String, Number] as PropType<string | number>,
    icon: { type: [String, Object, Function], default: undefined },
    variant: { type: String as PropType<CloseButtonVariant>, default: undefined },
    __staticSelector: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('CloseButton', defaultProps, rawProps)
    const getStyles = useStyles({
      name: props.__staticSelector || 'CloseButton',
      props,
      className: attrs.class,
      style: attrs.style as any,
      classes,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    return () =>
      h(
        UnstyledButton,
        {
          ...attrs,
          ...getStyles('root'),
          component: props.component,
          unstyled: props.unstyled,
          variant: props.variant,
          disabled: props.disabled,
          mod: { disabled: props.disabled },
        },
        () => [props.icon ? props.icon : h(CloseIcon), slots.default?.()],
      )
  },
})
