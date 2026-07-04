import { defineComponent, h, type PropType } from 'vue'
import { Switch } from '@mantine-vue/core'
import { getControlLabel } from './get-control-label'

export const ConfiguratorBooleanControl = defineComponent({
  name: 'ConfiguratorBooleanControl',
  inheritAttrs: false,
  props: {
    value: { type: Boolean, default: undefined },
    onChange: { type: Function as PropType<(value: boolean) => void>, required: true },
    prop: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(Switch, {
        ...attrs,
        checked: props.value,
        onChange: (event: Event) =>
          props.onChange((event.currentTarget as HTMLInputElement).checked),
        label: getControlLabel(props.prop),
      })
  },
})
