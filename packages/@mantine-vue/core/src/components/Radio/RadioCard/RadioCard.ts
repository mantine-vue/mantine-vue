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
import { useRadioGroupContext } from '../RadioGroup/RadioGroup'
import classes from './RadioCard.module.css'

export interface RadioCardContextValue {
  checked: boolean
}

const RadioCardContextKey: InjectionKey<RadioCardContextValue> = Symbol('RadioCardContext')

export function useRadioCardContext() {
  return inject(RadioCardContextKey, null)
}

const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  card: {
    '--card-radius': getRadius(radius),
  },
}))

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

export const RadioCard = withBoxProps(
  defineComponent({
    name: 'RadioCard',
    inheritAttrs: false,
    props: {
      modelValue: { type: Boolean, default: undefined },
      checked: { type: Boolean, default: undefined },
      defaultChecked: { type: Boolean, default: undefined },
      onChange: { type: Function as PropType<(checked: boolean) => void>, default: undefined },
      withBorder: { type: Boolean, default: true },
      radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
      value: { type: String, default: undefined },
      name: { type: String, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'update:checked', 'change'],
    setup(props, { attrs, slots, emit }) {
      const groupContext = useRadioGroupContext()
      const [localChecked, setLocalChecked] = useUncontrolled<boolean>({
        value: () => (props.modelValue !== undefined ? props.modelValue : props.checked),
        defaultValue: props.defaultChecked,
        finalValue: false,
        onChange: (checked) => {
          emit('update:modelValue', checked)
          emit('update:checked', checked)
          emit('change', checked)
        },
      })
      const getStyles = useStyles({
        name: 'RadioCard',
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

      const isChecked = () =>
        groupContext ? groupContext.value === props.value : localChecked.value

      provide(RadioCardContextKey, {
        get checked() {
          return isChecked()
        },
      })

      return () => {
        const checked = isChecked()
        const name = props.name || groupContext?.name

        return h(
          UnstyledButton,
          {
            ...attrs,
            ...getStyles('card', { className: attrs.class, style: attrs.style as any }),
            __staticSelector: 'RadioCard',
            mod: [{ 'with-border': props.withBorder, checked }, props.mod],
            role: 'radio',
            name,
            'aria-checked': checked,
            onClick: (event: MouseEvent) => {
              callHandler(attrs.onClick, event)
              groupContext?.onChange(props.value || '')
              setLocalChecked(true)
            },
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)

Object.assign(RadioCard, { classes, varsResolver })
