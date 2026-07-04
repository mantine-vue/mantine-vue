import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  useProps,
  useStyles,
} from '../../core'
import { Loader } from '../Loader'
import { Transition } from '../Transition'
import { UnstyledButton } from '../UnstyledButton'
import { ActionIconGroup } from './ActionIconGroup/ActionIconGroup'
import { ActionIconGroupSection } from './ActionIconGroupSection/ActionIconGroupSection'
import classes from './ActionIcon.module.css'

export type ActionIconVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'subtle'
  | 'default'
  | 'gradient'

const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, variant, gradient, color, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--ai-size': getSize(size, 'ai-size'),
        '--ai-radius': radius === undefined ? undefined : getRadius(radius),
        '--ai-bg': color || variant ? colors.background : undefined,
        '--ai-hover': color || variant ? colors.hover : undefined,
        '--ai-hover-color': color || variant ? colors.hoverColor : undefined,
        '--ai-color': colors.color,
        '--ai-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)

const ActionIconBase = defineComponent({
  name: 'ActionIcon',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'button' },
    loading: { type: Boolean, default: false },
    loaderProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    size: [String, Number] as PropType<string | number>,
    color: { type: String, default: undefined },
    radius: [String, Number] as PropType<string | number>,
    gradient: {
      type: Object as PropType<{ from: string; to: string; deg?: number }>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    autoContrast: { type: Boolean, default: undefined },
    variant: { type: String as PropType<ActionIconVariant>, default: undefined },
    __staticSelector: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('ActionIcon', null, rawProps)
    const getStyles = useStyles({
      name: props.__staticSelector ?? 'ActionIcon',
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
          ...getStyles('root', {
            active: !props.disabled && !props.loading && !attrs['data-disabled'],
          }),
          component: props.component,
          unstyled: props.unstyled,
          variant: props.variant,
          disabled: props.disabled || props.loading,
          mod: { loading: props.loading, disabled: props.disabled },
        },
        () => [
          h(
            Transition,
            { mounted: props.loading, transition: 'slide-down', duration: 150 },
            {
              default: (transitionStyles: any) =>
                props.loading
                  ? h(
                      Box,
                      {
                        component: 'span',
                        ...getStyles('loader', { style: transitionStyles }),
                        'aria-hidden': 'true',
                      },
                      () =>
                        h(Loader, {
                          color: 'var(--ai-color)',
                          size: 'calc(var(--ai-size) * 0.55)',
                          ...props.loaderProps,
                        }),
                    )
                  : null,
            },
          ),
          h(Box, { component: 'span', mod: { loading: props.loading }, ...getStyles('icon') }, () =>
            slots.default?.(),
          ),
        ],
      )
  },
})

export const ActionIcon = withBoxProps(
  Object.assign(ActionIconBase, {
    Group: ActionIconGroup,
    GroupSection: ActionIconGroupSection,
  }),
)
