import { defineComponent, h, type PropType } from 'vue'
import { Input, Slider } from '@mantine-vue/core'
import { getControlLabel } from './get-control-label'

export const ConfiguratorNumberControl = defineComponent({
  name: 'ConfiguratorNumberControl',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
    onChange: { type: Function as PropType<(value: number) => void>, required: true },
    prop: { type: String, required: true },
    step: { type: Number, default: undefined },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
  },
  setup(props, { attrs }) {
    return () =>
      h(Input.Wrapper, { ...attrs, labelElement: 'div', label: getControlLabel(props.prop) }, () =>
        h(Slider, {
          value: props.value,
          onChange: props.onChange,
          step: props.step,
          min: props.min,
          max: props.max,
          thumbLabel: 'Size',
        }),
      )
  },
})
