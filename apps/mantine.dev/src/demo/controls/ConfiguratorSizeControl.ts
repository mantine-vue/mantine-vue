import { defineComponent, h, type PropType } from 'vue'
import { Input, Slider } from '@mantine-vue/core'
import { getControlLabel } from './get-control-label'

const MARKS = [
  { value: 0, label: 'xs' },
  { value: 25, label: 'sm' },
  { value: 50, label: 'md' },
  { value: 75, label: 'lg' },
  { value: 100, label: 'xl' },
]

export const ConfiguratorSizeControl = defineComponent({
  name: 'ConfiguratorSizeControl',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    onChange: { type: Function as PropType<(value: string) => void>, required: true },
    prop: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const currentValue = MARKS.find((mark) => mark.label === props.value)!.value
      const handleChange = (val: number) =>
        props.onChange(MARKS.find((mark) => mark.value === val)!.label)

      return h(
        Input.Wrapper,
        { ...attrs, labelElement: 'div', label: getControlLabel(props.prop) },
        () =>
          h(Slider, {
            value: currentValue,
            onChange: handleChange,
            label: (val: number) => MARKS.find((mark) => mark.value === val)!.label,
            step: 25,
            marks: MARKS,
            styles: { markLabel: { display: 'none' } },
            thumbLabel: 'Size',
          }),
      )
    }
  },
})
