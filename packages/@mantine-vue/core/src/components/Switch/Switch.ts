import { defineComponent, h, ref, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { useId, useUncontrolled, assignRef } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  getThemeColor,
  resolveNode,
  type MantineNode,
  useStyles,
} from '../../core'
import { InlineInput, InlineInputClasses } from '../../utils'
import { SwitchGroup, useSwitchGroupContext } from './SwitchGroup/SwitchGroup'
import classes from './Switch.module.css'

export interface SwitchSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  thumbIcon?: () => VNodeChild
  onLabel?: () => VNodeChild
  offLabel?: () => VNodeChild
}

export type SwitchStylesNames =
  | 'root'
  | 'track'
  | 'trackLabel'
  | 'thumb'
  | 'input'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'

const mergedClasses = { ...InlineInputClasses, ...classes }

const varsResolver = createVarsResolver<any>((theme, { radius, color, size }) => ({
  root: {
    '--switch-radius': radius === undefined ? undefined : getRadius(radius),
    '--switch-height': getSize(size, 'switch-height'),
    '--switch-width': getSize(size, 'switch-width'),
    '--switch-thumb-size': getSize(size, 'switch-thumb-size'),
    '--switch-label-font-size': getSize(size, 'switch-label-font-size'),
    '--switch-track-label-padding': getSize(size, 'switch-track-label-padding'),
    '--switch-color': color ? getThemeColor(color, theme) : undefined,
  },
}))

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

const SwitchBase = defineComponent({
  name: 'Switch',
  inheritAttrs: false,
  slots: Object as SlotsType<SwitchSlots>,
  props: {
    id: { type: String, default: undefined },
    label: { type: null as unknown as PropType<MantineNode>, default: undefined },
    offLabel: { type: null as unknown as PropType<MantineNode>, default: undefined },
    onLabel: { type: null as unknown as PropType<MantineNode>, default: undefined },
    color: { type: String, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    radius: { type: [String, Number] as PropType<string | number>, default: 'xl' },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    thumbIcon: { type: null as unknown as PropType<MantineNode>, default: undefined },
    labelPosition: { type: String as PropType<'left' | 'right'>, default: 'right' },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
    error: {
      type: null as unknown as PropType<MantineNode | boolean>,
      default: undefined,
    },
    rootRef: { type: [Object, Function] as PropType<any>, default: undefined },
    withThumbIndicator: { type: Boolean, default: true },
    checked: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: undefined },
    onChange: { type: Function as PropType<(event: Event) => void>, default: undefined },
    disabled: { type: Boolean, default: false },
    variant: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const uuid = useId(props.id)
    const groupContext = useSwitchGroupContext()
    const internalChecked = ref(false)
    const [checked, setChecked] = useUncontrolled<boolean>({
      value: () => props.checked,
      defaultValue: props.defaultChecked,
      finalValue: false,
      onChange: (value) => {
        internalChecked.value = value
      },
    })
    const getStyles = useStyles({
      name: 'Switch',
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
      const thumbIcon = resolveNode(props.thumbIcon, slots.thumbIcon)
      const onLabel = resolveNode(props.onLabel, slots.onLabel)
      const offLabel = resolveNode(props.offLabel, slots.offLabel)
      const descriptionId = description ? `${id}-description` : undefined
      const errorId = error && typeof error !== 'boolean' ? `${id}-error` : undefined
      const describedBy =
        [descriptionId, errorId, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined
      const value = String(attrs.value ?? '')
      const currentChecked = groupContext ? groupContext.value.includes(value) : checked.value
      const disabled = groupContext?.isDisabled?.(value) || props.disabled
      const size = groupContext?.size ?? props.size

      return h(
        InlineInput,
        {
          ...props.wrapperProps,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          __staticSelector: 'Switch',
          __stylesApiProps: props,
          id,
          size,
          labelPosition: props.labelPosition,
          label,
          description,
          error,
          disabled,
          bodyElement: 'label',
          labelElement: 'span',
          classNames: props.classNames,
          styles: props.styles,
          unstyled: props.unstyled,
          'data-checked': currentChecked || undefined,
          variant: props.variant,
          ref: (node: any) => assignRef(props.rootRef, node?.$el ?? node ?? null),
          mod: props.mod,
        },
        () => [
          h('input', {
            ...attrs,
            ...getStyles('input'),
            disabled,
            checked: currentChecked,
            id,
            type: 'checkbox',
            role: 'switch',
            'aria-describedby': describedBy,
            onChange: (event: Event) => {
              callHandler(attrs.onChange, event)
              props.onChange?.(event)
              if (groupContext) {
                groupContext.onChange(event)
              } else {
                setChecked((event.currentTarget as HTMLInputElement).checked)
              }
            },
          }),
          h(
            Box,
            {
              component: 'span',
              'aria-hidden': 'true',
              mod: {
                error: Boolean(error),
                labelPosition: props.labelPosition,
                withoutLabels: !onLabel && !offLabel,
              },
              ...getStyles('track'),
            },
            () => [
              h(
                Box,
                {
                  component: 'span',
                  mod: { withThumbIndicator: props.withThumbIndicator && !thumbIcon },
                  ...getStyles('thumb'),
                },
                () => thumbIcon,
              ),
              h('span', getStyles('trackLabel'), (currentChecked ? onLabel : offLabel) as any),
            ],
          ),
        ],
      )
    }
  },
})

export const Switch = withBoxProps(
  Object.assign(SwitchBase, {
    classes: mergedClasses,
    varsResolver,
    Group: SwitchGroup,
  }),
)
