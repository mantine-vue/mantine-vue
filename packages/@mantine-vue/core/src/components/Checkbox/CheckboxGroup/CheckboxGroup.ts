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
import { useUncontrolled } from '@mantine-vue/hooks'
import { resolveNode, type MantineNode } from '../../../core'
import { InputWrapper } from '../../Input'
import { InputsGroupFieldset } from '../../../utils'

export interface CheckboxGroupContextValue {
  value: string[]
  onChange: (eventOrValue: Event | string) => void
  size?: string | number
  isDisabled?: (value: string) => boolean
}

export interface CheckboxGroupSlots {
  default?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
}

const CheckboxGroupContextKey: InjectionKey<CheckboxGroupContextValue> =
  Symbol('CheckboxGroupContext')

export function useCheckboxGroupContext() {
  return inject(CheckboxGroupContextKey, null)
}

export const CheckboxGroup = defineComponent({
  name: 'CheckboxGroup',
  inheritAttrs: false,
  slots: Object as SlotsType<CheckboxGroupSlots>,
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
    const [value, setValue] = useUncontrolled<string[]>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: [],
      onChange: (nextValue) => props.onChange?.(nextValue),
    })

    const handleChange = (eventOrValue: Event | string) => {
      if (props.readOnly) {
        return
      }

      const itemValue =
        typeof eventOrValue === 'string'
          ? eventOrValue
          : String((eventOrValue.currentTarget as HTMLInputElement | null)?.value ?? '')
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

    const isDisabled = (checkboxValue: string) => {
      if (props.disabled) {
        return true
      }

      if (!props.maxSelectedValues) {
        return false
      }

      const isCurrentlySelected = value.value.includes(checkboxValue)
      const hasReachedLimit = value.value.length >= props.maxSelectedValues
      return !isCurrentlySelected && hasReachedLimit
    }

    provide(CheckboxGroupContextKey, {
      get value() {
        return value.value
      },
      onChange: handleChange,
      get size() {
        return props.size
      },
      isDisabled,
    })

    return () => {
      const hiddenInputValue = value.value.join(props.hiddenInputValuesSeparator)

      return h(
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
          __staticSelector: 'CheckboxGroup',
        } as any,
        () => [
          h(InputsGroupFieldset, { role: 'group' }, () => slots.default?.()),
          h('input', {
            type: 'hidden',
            name: props.name,
            value: hiddenInputValue,
            ...props.hiddenInputProps,
          }),
        ],
      )
    }
  },
})

Object.assign(CheckboxGroup, { classes: InputWrapper.classes })
