import { defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { InputWrapper } from '../../Input'
import { InputsGroupFieldset } from '../../../utils'

export interface SwitchGroupContextValue {
  value: string[]
  onChange: (event: Event) => void
  size?: string | number
  isDisabled?: (value: string) => boolean
}

const SwitchGroupContextKey: InjectionKey<SwitchGroupContextValue> = Symbol('SwitchGroupContext')

export function useSwitchGroupContext() {
  return inject(SwitchGroupContextKey, null)
}

export const SwitchGroup = defineComponent({
  name: 'SwitchGroup',
  inheritAttrs: false,
  props: {
    value: { type: Array as PropType<string[] | undefined>, default: undefined },
    defaultValue: { type: Array as PropType<string[] | undefined>, default: undefined },
    onChange: { type: Function as PropType<(value: string[]) => void>, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    readOnly: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    hiddenInputValuesSeparator: { type: String, default: ',' },
    maxSelectedValues: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    description: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    error: {
      type: [String, Number, Object, Function, Boolean] as PropType<any>,
      default: undefined,
    },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const [value, setValue] = useUncontrolled<string[]>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: [],
      onChange: (nextValue) => props.onChange?.(nextValue),
    })

    const handleChange = (event: Event) => {
      if (props.readOnly) {
        return
      }

      const itemValue = String((event.currentTarget as HTMLInputElement | null)?.value ?? '')
      const isCurrentlySelected = value.value.includes(itemValue)

      if (
        !isCurrentlySelected &&
        props.maxSelectedValues &&
        value.value.length >= props.maxSelectedValues
      ) {
        return
      }

      setValue(
        isCurrentlySelected
          ? value.value.filter((item) => item !== itemValue)
          : [...value.value, itemValue],
      )
    }

    const isDisabled = (switchValue: string) => {
      if (props.disabled) {
        return true
      }

      if (!props.maxSelectedValues) {
        return false
      }

      const isCurrentlySelected = value.value.includes(switchValue)
      const hasReachedLimit = value.value.length >= props.maxSelectedValues
      return !isCurrentlySelected && hasReachedLimit
    }

    provide(SwitchGroupContextKey, {
      get value() {
        return value.value
      },
      onChange: handleChange,
      get size() {
        return props.size
      },
      isDisabled,
    })

    return () =>
      h(
        InputWrapper,
        {
          size: props.size,
          ...props.wrapperProps,
          ...attrs,
          label: props.label,
          description: props.description,
          error: props.error,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
          labelElement: 'div',
          __staticSelector: 'SwitchGroup',
        } as any,
        () => [
          h(InputsGroupFieldset, { role: 'group' }, () => slots.default?.()),
          h('input', {
            type: 'hidden',
            name: props.name,
            value: value.value.join(props.hiddenInputValuesSeparator),
            ...props.hiddenInputProps,
          }),
        ],
      )
  },
})

Object.assign(SwitchGroup, { classes: InputWrapper.classes })
