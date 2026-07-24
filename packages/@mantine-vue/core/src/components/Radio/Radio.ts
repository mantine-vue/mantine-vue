import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useId, assignRef } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getSize,
  getThemeColor,
  resolveNode,
  type MantineColor,
  type MantineNode,
  type MantineRadius,
  type MantineSize,
  useStyles,
} from '../../core'
import { InlineInput, InlineInputClasses } from '../../utils'
import { RadioCard } from './RadioCard/RadioCard'
import { RadioGroup, useRadioGroupContext } from './RadioGroup/RadioGroup'
import { RadioIcon } from './RadioIcon'
import { RadioIndicator } from './RadioIndicator/RadioIndicator'
import classes from './Radio.module.css'

export type RadioVariant = 'filled' | 'outline'

export interface RadioSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  icon?: (props: { class?: any; style?: any }) => VNodeChild
}
export type RadioStylesNames =
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'
  | 'inner'
  | 'radio'
  | 'icon'

const mergedClasses = { ...InlineInputClasses, ...classes }

const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, color, iconColor, autoContrast }) => ({
    root: {
      '--radio-size': getSize(size, 'radio-size'),
      '--radio-radius': radius === undefined ? undefined : getRadius(radius),
      '--radio-color': getThemeColor(color, theme),
      '--radio-icon-color': iconColor
        ? getThemeColor(iconColor, theme)
        : getAutoContrastValue(autoContrast, theme)
          ? getContrastColor({ color, theme, autoContrast })
          : undefined,
      '--radio-icon-size': getSize(size, 'radio-icon-size'),
    },
  }),
)

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

const RadioBase = defineComponent({
  name: 'Radio',
  inheritAttrs: false,
  slots: Object as SlotsType<RadioSlots>,
  props: {
    id: { type: String, default: undefined },
    label: { type: null as unknown as PropType<MantineNode>, default: undefined },
    color: { type: String as PropType<MantineColor>, default: undefined },
    size: { type: String as PropType<MantineSize | (string & {})>, default: 'sm' },
    icon: { type: [Object, Function] as PropType<any>, default: undefined },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    labelPosition: { type: String as PropType<'left' | 'right'>, default: 'right' },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
    error: {
      type: null as unknown as PropType<MantineNode | boolean>,
      default: undefined,
    },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: 'xl' },
    rootRef: { type: [Object, Function] as PropType<any>, default: undefined },
    iconColor: { type: String, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    withErrorStyles: { type: Boolean, default: true },
    checked: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    variant: { type: String as PropType<RadioVariant>, default: 'filled' },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const uuid = useId(props.id)
    const groupContext = useRadioGroupContext()
    const getStyles = useStyles({
      name: 'Radio',
      props,
      classes: mergedClasses,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    return () => {
      const id = uuid.value || props.id || ''
      const label = resolveNode(props.label, slots.label)
      const description = resolveNode(props.description, slots.description)
      const error = resolveNode(props.error, slots.error)
      const descriptionId = description ? `${id}-description` : undefined
      const errorId = error && typeof error !== 'boolean' ? `${id}-error` : undefined
      const describedBy =
        [descriptionId, errorId, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined
      const iconStyles = getStyles('icon')
      const Icon = props.icon || RadioIcon
      const value = String(attrs.value ?? '')
      const checked = groupContext ? groupContext.value === value : props.checked
      const disabled = groupContext?.disabled || props.disabled
      const size = groupContext?.size ?? props.size
      const name = groupContext?.name ?? attrs.name

      return h(
        InlineInput,
        {
          ...props.wrapperProps,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          __staticSelector: 'Radio',
          __stylesApiProps: props,
          id,
          size,
          labelPosition: props.labelPosition,
          label,
          description,
          error,
          disabled,
          classNames: props.classNames,
          styles: props.styles,
          unstyled: props.unstyled,
          'data-checked': checked || undefined,
          variant: props.variant,
          ref: (node: any) => assignRef(props.rootRef, node?.$el ?? node ?? null),
          mod: props.mod,
        },
        () =>
          h(Box, { ...getStyles('inner'), mod: { labelPosition: props.labelPosition } }, () => [
            h(Box, {
              ...attrs,
              ...getStyles('radio'),
              component: 'input',
              id,
              checked,
              disabled,
              name,
              type: 'radio',
              'aria-describedby': describedBy,
              mod: { error: Boolean(error), withErrorStyles: props.withErrorStyles },
              variant: props.variant,
              onChange: (event: Event) => {
                callHandler(attrs.onChange, event)
                groupContext?.onChange(event)
              },
            }),
            slots.icon ? slots.icon(iconStyles) : h(Icon, iconStyles),
          ]),
      )
    }
  },
})

export const Radio = withBoxProps(
  Object.assign(RadioBase, {
    classes: mergedClasses,
    varsResolver,
    Group: RadioGroup,
    Indicator: RadioIndicator,
    Card: RadioCard,
  }),
)
