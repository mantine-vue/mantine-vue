import { defineComponent, h, type PropType } from 'vue'
import { Input, SegmentedControl } from '@mantine-vue/core'
import { getControlLabel } from './get-control-label'
import { transformSelectData, type SelectData } from './transform-select-data'

export const ConfiguratorSegmentedControl = defineComponent({
  name: 'ConfiguratorSegmentedControl',
  inheritAttrs: false,
  props: {
    data: { type: Array as PropType<SelectData>, required: true },
    value: { type: String, required: true },
    onChange: { type: Function as PropType<(value: string) => void>, required: true },
    prop: { type: String, required: true },
    transformLabel: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(Input.Wrapper, { ...attrs, labelElement: 'div', label: getControlLabel(props.prop) }, () =>
        h(SegmentedControl, {
          data: props.transformLabel ? transformSelectData(props.data) : props.data,
          value: props.value,
          onChange: props.onChange,
          fullWidth: true,
          transitionDuration: 150,
        }),
      )
  },
})
