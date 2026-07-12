import {
  defineComponent,
  h,
  inject,
  provide,
  type InjectionKey,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { resolveNode, type MantineNode } from '../../../core'
import { InputWrapper } from '../../Input'
import { InputsGroupFieldset } from '../../../utils'

export interface RadioGroupContextValue {
  value: string | null
  onChange: (eventOrValue: Event | string) => void
  size?: string | number
  name?: string
  disabled?: boolean
}

export interface RadioGroupSlots {
  default?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
}

const RadioGroupContextKey: InjectionKey<RadioGroupContextValue> = Symbol('RadioGroupContext')

export function useRadioGroupContext() {
  return inject(RadioGroupContextKey, null)
}

export const RadioGroup = defineComponent({
  name: 'RadioGroup',
  inheritAttrs: false,
  slots: Object as SlotsType<RadioGroupSlots>,
  props: {
    value: { type: String as PropType<string | null | undefined>, default: undefined },
    defaultValue: { type: String as PropType<string | null | undefined>, default: undefined },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    name: { type: String, default: undefined },
    readOnly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: null as unknown as PropType<MantineNode>, default: undefined },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
    error: {
      type: null as unknown as PropType<MantineNode | boolean>,
      default: undefined,
    },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const name = useId(props.name)
    const [value, setValue] = useUncontrolled<string | null>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: '',
      onChange: (nextValue) => props.onChange?.(String(nextValue ?? '')),
    })

    const handleChange = (eventOrValue: Event | string) => {
      if (props.readOnly) {
        return
      }

      const itemValue =
        typeof eventOrValue === 'string'
          ? eventOrValue
          : String((eventOrValue.currentTarget as HTMLInputElement | null)?.value ?? '')
      setValue(itemValue)
    }

    provide(RadioGroupContextKey, {
      get value() {
        return value.value
      },
      onChange: handleChange,
      get size() {
        return props.size
      },
      get name() {
        return name.value || props.name
      },
      get disabled() {
        return props.disabled
      },
    })

    return () =>
      h(
        InputWrapper,
        {
          size: props.size,
          ...props.wrapperProps,
          ...attrs,
          label: resolveNode(props.label, slots.label),
          description: resolveNode(props.description, slots.description),
          error: resolveNode(props.error, slots.error),
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
          labelElement: 'div',
          __staticSelector: 'RadioGroup',
        } as any,
        () => h(InputsGroupFieldset, { role: 'radiogroup' }, () => slots.default?.()),
      )
  },
})

Object.assign(RadioGroup, { classes: InputWrapper.classes })
