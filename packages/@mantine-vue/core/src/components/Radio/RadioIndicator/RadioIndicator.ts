import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getSize,
  getThemeColor,
  useStyles,
} from '../../../core'
import { RadioIcon } from '../RadioIcon'
import { useRadioCardContext } from '../RadioCard/RadioCard'
import classes from './RadioIndicator.module.css'

export type RadioIndicatorVariant = 'filled' | 'outline'

export interface RadioIndicatorSlots {
  icon?: (props: { class?: any; style?: any }) => VNodeChild
}

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, size, iconColor, autoContrast }) => ({
    indicator: {
      '--radio-size': getSize(size, 'radio-size'),
      '--radio-radius': radius === undefined ? undefined : getRadius(radius),
      '--radio-color': getThemeColor(color, theme),
      '--radio-icon-size':
        typeof size === 'number'
          ? `calc(${getSize(size, 'radio-size')} * 0.4)`
          : getSize(size, 'radio-icon-size'),
      '--radio-icon-color': iconColor
        ? getThemeColor(iconColor, theme)
        : getAutoContrastValue(autoContrast, theme)
          ? getContrastColor({ color, theme, autoContrast })
          : undefined,
    },
  }),
)

export const RadioIndicator = withBoxProps(
  defineComponent({
    name: 'RadioIndicator',
    inheritAttrs: false,
    slots: Object as SlotsType<RadioIndicatorSlots>,
    props: {
      color: { type: String, default: undefined },
      size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      iconColor: { type: String, default: undefined },
      autoContrast: { type: Boolean, default: undefined },
      icon: { type: [Object, Function] as PropType<any>, default: undefined },
      checked: { type: Boolean, default: undefined },
      disabled: { type: Boolean, default: false },
      variant: { type: String as PropType<RadioIndicatorVariant>, default: 'filled' },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const cardContext = useRadioCardContext()
      const getStyles = useStyles({
        name: 'RadioIndicator',
        props,
        classes,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
        vars: props.vars as any,
        varsResolver,
      })

      return () => {
        const iconStyles = getStyles('icon')
        const Icon = props.icon || RadioIcon
        const checked =
          typeof props.checked === 'boolean' ? props.checked : cardContext?.checked || false

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('indicator', { className: attrs.class, style: attrs.style as any }),
            variant: props.variant,
            mod: [{ checked, disabled: props.disabled }, props.mod],
          },
          () => (slots.icon ? slots.icon(iconStyles) : h(Icon, iconStyles)),
        )
      }
    },
  }),
)

Object.assign(RadioIndicator, { classes, varsResolver })
