import { defineComponent, h, type PropType } from 'vue'
import { TextInput } from '@mantine-vue/core'
import { getControlLabel } from './get-control-label'

export const ConfiguratorStringControl = defineComponent({
  name: 'ConfiguratorStringControl',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    onChange: { type: Function as PropType<(value: string) => void>, required: true },
    prop: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(TextInput, {
        ...attrs,
        modelValue: props.value,
        'onUpdate:modelValue': (value: string) => props.onChange(value),
        label: getControlLabel(props.prop),
        placeholder: 'Enter prop value',
      })
  },
})
