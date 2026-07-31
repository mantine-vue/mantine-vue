import { defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'

export type ChipGroupValue = string | null | string[]

export interface ChipGroupContextValue {
  isChipSelected: (value: string) => boolean
  onChange: (event: Event) => void
  multiple?: boolean
}

const ChipGroupContextKey: InjectionKey<ChipGroupContextValue> = Symbol('ChipGroupContext')

export function useChipGroupContext() {
  return inject(ChipGroupContextKey, null)
}

export const ChipGroup = defineComponent({
  name: 'ChipGroup',
  props: {
    multiple: { type: Boolean, default: false },
    modelValue: {
      type: [String, Array] as PropType<string | string[] | null | undefined>,
      default: undefined,
    },
    value: {
      type: [String, Array] as PropType<string | string[] | null | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Array] as PropType<string | string[] | null | undefined>,
      default: undefined,
    },
    onChange: {
      type: Function as PropType<(value: string | string[]) => void>,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    const [value, setValue] = useUncontrolled<ChipGroupValue>({
      value: () => (props.modelValue !== undefined ? props.modelValue : props.value),
      defaultValue: props.defaultValue,
      finalValue: props.multiple ? [] : null,
      onChange: (nextValue) => {
        emit('update:modelValue', nextValue)
        emit('change', nextValue)
      },
    })

    const isChipSelected = (chipValue: string) =>
      Array.isArray(value.value) ? value.value.includes(chipValue) : value.value === chipValue

    const handleChange = (event: Event) => {
      const chipValue = String((event.currentTarget as HTMLInputElement | null)?.value ?? '')

      if (Array.isArray(value.value)) {
        setValue(
          value.value.includes(chipValue)
            ? value.value.filter((item) => item !== chipValue)
            : [...value.value, chipValue],
        )
      } else {
        setValue(chipValue)
      }
    }

    provide(ChipGroupContextKey, {
      isChipSelected,
      onChange: handleChange,
      get multiple() {
        return props.multiple
      },
    })

    return () => h('div', { style: { display: 'contents' } }, slots.default?.())
  },
})
