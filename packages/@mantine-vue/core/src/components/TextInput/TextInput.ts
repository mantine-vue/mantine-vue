import { defineComponent, h, type PropType } from 'vue'
import { InputBase } from '../InputBase'

export const TextInput = defineComponent({
  name: 'TextInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    value: { type: [String, Number] as PropType<string | number | undefined>, default: undefined },
    defaultValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        InputBase,
        {
          ...attrs,
          modelValue: props.modelValue,
          value: props.value,
          defaultValue: props.defaultValue,
          'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
          onChange: (value: string) => emit('change', value),
          component: 'input',
          __staticSelector: 'TextInput',
          __stylesApiProps: attrs,
        },
        slots,
      )
  },
})

Object.assign(TextInput, { classes: InputBase.classes })
