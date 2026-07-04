import { defineComponent, h, type PropType } from 'vue'
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
  useStyles,
} from '../../core'
import { InlineInput, InlineInputClasses } from '../../utils'
import { CheckboxIcon } from './CheckIcon'
import { CheckboxCard } from './CheckboxCard/CheckboxCard'
import { CheckboxGroup, useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroup'
import { CheckboxIndicator } from './CheckboxIndicator/CheckboxIndicator'
import classes from './Checkbox.module.css'

export type CheckboxVariant = 'filled' | 'outline'
export type CheckboxStylesNames =
  | 'icon'
  | 'inner'
  | 'input'
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'

const mergedClasses = { ...InlineInputClasses, ...classes }

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, size, iconColor, autoContrast }) => ({
    root: {
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

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

const CheckboxBase = defineComponent({
  name: 'Checkbox',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    color: { type: String, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    radius: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    labelPosition: { type: String as PropType<'left' | 'right'>, default: 'right' },
    description: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    indeterminate: { type: Boolean, default: false },
    icon: { type: [Object, Function] as PropType<any>, default: undefined },
    rootRef: { type: [Object, Function] as PropType<any>, default: undefined },
    iconColor: { type: String, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    withErrorStyles: { type: Boolean, default: true },
    checked: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    variant: { type: String as PropType<CheckboxVariant>, default: 'filled' },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    const uuid = useId(props.id)
    const groupContext = useCheckboxGroupContext()
    const getStyles = useStyles({
      name: 'Checkbox',
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
      const descriptionId = props.description ? `${id}-description` : undefined
      const errorId = props.error && typeof props.error !== 'boolean' ? `${id}-error` : undefined
      const describedBy =
        [descriptionId, errorId, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined
      const Icon = props.icon || CheckboxIcon
      const value = String(attrs.value ?? '')
      const checked = groupContext ? groupContext.value.includes(value) : props.checked
      const disabled = groupContext?.isDisabled?.(value) || props.disabled
      const size = groupContext?.size ?? props.size

      return h(
        InlineInput,
        {
          ...props.wrapperProps,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          __staticSelector: 'Checkbox',
          __stylesApiProps: props,
          id,
          size,
          labelPosition: props.labelPosition,
          label: props.label,
          description: props.description,
          error: props.error,
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
              ...getStyles('input', { style: undefined }),
              component: 'input',
              id,
              checked: props.indeterminate ? false : checked,
              disabled,
              readonly: props.readOnly,
              type: 'checkbox',
              'aria-describedby': describedBy,
              'data-indeterminate': props.indeterminate || undefined,
              mod: { error: Boolean(props.error), withErrorStyles: props.withErrorStyles },
              variant: props.variant,
              onClick: (event: MouseEvent) => {
                callHandler(attrs.onClick, event)
                if (props.readOnly && props.checked === undefined) {
                  event.preventDefault()
                }
              },
              onChange: (event: Event) => {
                callHandler(attrs.onChange, event)
                groupContext?.onChange(event)
              },
            }),
            h(Icon, { indeterminate: props.indeterminate, ...getStyles('icon') }),
          ]),
      )
    }
  },
})

export const Checkbox = withBoxProps(
  Object.assign(CheckboxBase, {
    classes: mergedClasses,
    varsResolver,
    Group: CheckboxGroup,
    Indicator: CheckboxIndicator,
    Card: CheckboxCard,
  }),
)
