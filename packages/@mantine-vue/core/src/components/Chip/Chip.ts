import { defineComponent, h, type PropType } from 'vue'
import { assignRef, useId, useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getRadius,
  getSize,
  useProps,
  useStyles,
  type MantineColor,
  type MantineRadius,
  type MantineSize,
} from '../../core'
import { CheckIcon } from '../Checkbox'
import { ChipGroup, useChipGroupContext } from './ChipGroup/ChipGroup'
import classes from './Chip.module.css'

export type ChipStylesNames = 'root' | 'input' | 'iconWrapper' | 'checkIcon' | 'label'
export type ChipVariant = 'outline' | 'filled' | 'light'

const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, variant, color, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--chip-fz': getFontSize(size),
        '--chip-size': getSize(size, 'chip-size'),
        '--chip-radius': radius === undefined ? undefined : getRadius(radius),
        '--chip-checked-padding': getSize(size, 'chip-checked-padding'),
        '--chip-padding': getSize(size, 'chip-padding'),
        '--chip-icon-size': getSize(size, 'chip-icon-size'),
        '--chip-bg': color || variant ? colors.background : undefined,
        '--chip-hover': color || variant ? colors.hover : undefined,
        '--chip-color': color || variant ? colors.color : undefined,
        '--chip-bd': color || variant ? colors.border : undefined,
        '--chip-spacing': getSize(size, 'chip-spacing'),
      },
    }
  },
)

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

const ChipBase = defineComponent({
  name: 'Chip',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    size: { type: String as PropType<MantineSize>, default: 'sm' },
    type: { type: String as PropType<'radio' | 'checkbox'>, default: 'checkbox' },
    checked: { type: Boolean, default: undefined },
    defaultChecked: { type: Boolean, default: undefined },
    onChange: { type: Function as PropType<(checked: boolean) => void>, default: undefined },
    color: { type: String as PropType<MantineColor>, default: undefined },
    value: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    icon: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    rootRef: { type: [Object, Function] as PropType<any>, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    variant: { type: String as PropType<ChipVariant>, default: 'filled' },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Chip', null, rawProps)
    const groupContext = useChipGroupContext()
    const uuid = useId(props.id)
    const [value, setValue] = useUncontrolled<boolean>({
      value: () => props.checked,
      defaultValue: props.defaultChecked,
      finalValue: false,
      onChange: (nextValue) => props.onChange?.(nextValue),
    })
    const getStyles = useStyles({
      name: 'Chip',
      classes,
      props,
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
      const chipValue = props.value ?? String(attrs.value ?? '')
      const checked = groupContext ? groupContext.isChipSelected(chipValue) : value.value
      const inputType = groupContext ? (groupContext.multiple ? 'checkbox' : 'radio') : props.type
      const icon = props.icon ?? slots.icon
      const showIcon = checked && icon !== null && icon !== false
      const {
        class: _class,
        style: _style,
        onChange: attrsOnChange,
        value: _attrsValue,
        ...inputAttrs
      } = attrs as Record<string, any>
      const renderIcon = () => {
        const iconProps = getStyles('checkIcon')

        if (icon === undefined) {
          return h(CheckIcon, iconProps)
        }

        return typeof icon === 'function' ? icon(iconProps) : icon
      }

      return h(
        Box,
        {
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          ...props.wrapperProps,
          component: 'div',
          variant: props.variant,
          mod: props.mod,
          ref: (node: any) => assignRef(props.rootRef, node?.$el ?? node ?? null),
        },
        () => [
          h('input', {
            ...inputAttrs,
            ...getStyles('input'),
            id,
            type: inputType,
            checked,
            disabled: props.disabled,
            value: chipValue,
            onChange: (event: Event) => {
              callHandler(attrsOnChange, event)

              if (groupContext) {
                groupContext.onChange(event)
                props.onChange?.((event.currentTarget as HTMLInputElement).checked)
              } else {
                setValue((event.currentTarget as HTMLInputElement).checked)
              }
            },
          }),
          h(
            Box,
            {
              component: 'label',
              htmlFor: id,
              variant: props.variant || 'filled',
              mod: { checked, disabled: props.disabled },
              ...getStyles('label'),
            },
            () => [
              showIcon ? h('span', getStyles('iconWrapper'), renderIcon()) : null,
              h('span', null, slots.default?.()),
            ],
          ),
        ],
      )
    }
  },
})

export const Chip = withBoxProps(
  Object.assign(ChipBase, {
    classes,
    varsResolver,
    Group: ChipGroup,
  }),
)
