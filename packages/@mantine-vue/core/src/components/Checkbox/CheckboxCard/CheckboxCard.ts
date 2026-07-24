import { defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  createVarsResolver,
  getRadius,
  useStyles,
  type MantineRadius,
} from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useCheckboxGroupContext } from '../CheckboxGroup/CheckboxGroup'
import classes from './CheckboxCard.module.css'

export interface CheckboxCardContextValue {
  checked: boolean
}

const CheckboxCardContextKey: InjectionKey<CheckboxCardContextValue> = Symbol('CheckboxCardContext')

export function useCheckboxCardContext() {
  return inject(CheckboxCardContextKey, null)
}

const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  card: {
    '--card-radius': getRadius(radius),
  },
}))

export const CheckboxCard = withBoxProps(
  defineComponent({
    name: 'CheckboxCard',
    inheritAttrs: false,
    props: {
      checked: { type: Boolean, default: undefined },
      defaultChecked: { type: Boolean, default: undefined },
      onChange: { type: Function as PropType<(value: boolean) => void>, default: undefined },
      withBorder: { type: Boolean, default: true },
      radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
      value: { type: String, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const groupContext = useCheckboxGroupContext()
      const [checked, setChecked] = useUncontrolled<boolean>({
        value: () =>
          typeof props.checked === 'boolean'
            ? props.checked
            : groupContext
              ? groupContext.value.includes(props.value || '')
              : undefined,
        defaultValue: props.defaultChecked,
        finalValue: false,
        onChange: (nextValue) => props.onChange?.(nextValue),
      })
      const getStyles = useStyles({
        name: 'CheckboxCard',
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

      provide(CheckboxCardContextKey, {
        get checked() {
          return checked.value
        },
      })

      return () =>
        h(
          UnstyledButton,
          {
            ...attrs,
            ...getStyles('card', { className: attrs.class, style: attrs.style as any }),
            __staticSelector: 'CheckboxCard',
            mod: [{ 'with-border': props.withBorder, checked: checked.value }, props.mod],
            role: 'checkbox',
            'aria-checked': checked.value,
            onClick: (event: MouseEvent) => {
              const handler = attrs.onClick as ((event: MouseEvent) => void) | undefined
              handler?.(event)
              groupContext?.onChange(props.value || '')
              setChecked(!checked.value)
            },
          },
          () => slots.default?.(),
        )
    },
  }),
)

Object.assign(CheckboxCard, { classes, varsResolver })
