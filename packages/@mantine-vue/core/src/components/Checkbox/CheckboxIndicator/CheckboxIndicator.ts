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
  type MantineColor,
  type MantineRadius,
  type MantineSize,
} from '../../../core'
import { CheckboxIcon } from '../CheckIcon'
import { useCheckboxCardContext } from '../CheckboxCard/CheckboxCard'
import classes from './CheckboxIndicator.module.css'

export type CheckboxIndicatorVariant = 'filled' | 'outline'

export interface CheckboxIndicatorSlots {
  icon?: (props: { indeterminate?: boolean; class?: any; style?: any }) => VNodeChild
}

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, size, iconColor, autoContrast }) => ({
    indicator: {
      '--checkbox-size': getSize(size, 'checkbox-size'),
      '--checkbox-radius': radius === undefined ? undefined : getRadius(radius),
      '--checkbox-color': getThemeColor(color, theme),
      '--checkbox-icon-color': iconColor
        ? getThemeColor(iconColor, theme)
        : getAutoContrastValue(autoContrast, theme)
          ? getContrastColor({ color, theme, autoContrast })
          : undefined,
    },
  }),
)

export const CheckboxIndicator = withBoxProps(
  defineComponent({
    name: 'CheckboxIndicator',
    inheritAttrs: false,
    slots: Object as SlotsType<CheckboxIndicatorSlots>,
    props: {
      color: { type: String as PropType<MantineColor>, default: undefined },
      size: {
        type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
        default: 'sm',
      },
      radius: { type: [String, Number] as PropType<MantineRadius>, default: 'sm' },
      iconColor: { type: String, default: undefined },
      autoContrast: { type: Boolean, default: undefined },
      indeterminate: { type: Boolean, default: false },
      icon: { type: [Object, Function] as PropType<any>, default: undefined },
      checked: { type: Boolean, default: undefined },
      disabled: { type: Boolean, default: false },
      variant: { type: String as PropType<CheckboxIndicatorVariant>, default: 'filled' },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const cardContext = useCheckboxCardContext()
      const getStyles = useStyles({
        name: 'CheckboxIndicator',
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
        const Icon = props.icon || CheckboxIcon
        const checked =
          typeof props.checked === 'boolean' || props.indeterminate
            ? props.checked || props.indeterminate
            : cardContext?.checked || false

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('indicator', { className: attrs.class, style: attrs.style as any }),
            variant: props.variant,
            mod: [
              { checked, indeterminate: props.indeterminate, disabled: props.disabled },
              props.mod,
            ],
          },
          () =>
            slots.icon
              ? slots.icon({ indeterminate: props.indeterminate, ...iconStyles })
              : h(Icon, { indeterminate: props.indeterminate, ...iconStyles }),
        )
      }
    },
  }),
)

Object.assign(CheckboxIndicator, { classes, varsResolver })
