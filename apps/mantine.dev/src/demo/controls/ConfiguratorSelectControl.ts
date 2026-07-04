import { defineComponent, h, type PropType } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import { getControlLabel } from './get-control-label'
import { transformSelectData, type SelectData } from './transform-select-data'

export const ConfiguratorSelectControl = defineComponent({
  name: 'ConfiguratorSelectControl',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    data: { type: Array as PropType<SelectData>, required: true },
    onChange: { type: Function as PropType<(value: string) => void>, required: true },
    prop: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(NativeSelect, {
        ...attrs,
        value: props.value,
        onChange: (event: Event) =>
          props.onChange((event.currentTarget as HTMLSelectElement).value),
        label: getControlLabel(props.prop),
        data: transformSelectData(props.data),
      })
  },
})
