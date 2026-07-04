import { defineComponent, h } from 'vue'
import CodeDemo from './CodeDemo.vue'
import ConfiguratorDemo from './ConfiguratorDemo.vue'
import StylesApiDemo from './StylesApiDemo.vue'
import type { MantineDemo } from './types'

export const Demo = defineComponent({
  name: 'Demo',
  props: {
    data: { type: Object as () => MantineDemo, required: true },
  },
  setup(props) {
    return () => {
      const data = props.data
      if (data.type === 'configurator') {
        return h(ConfiguratorDemo, {
          component: data.component,
          code: data.code,
          controls: data.controls,
          centered: data.centered,
        })
      }
      if (data.type === 'styles-api') {
        return h(StylesApiDemo, {
          data: data.data,
          component: data.component,
          code: data.code,
          centered: data.centered,
          withPadding: data.withPadding,
          maxWidth: data.maxWidth,
          minHeight: data.minHeight,
          defaultExpanded: data.defaultExpanded,
        })
      }
      return h(CodeDemo, {
        component: data.component,
        code: data.code,
        centered: data.centered,
        withPadding: data.withPadding,
        maxWidth: data.maxWidth,
        minHeight: data.minHeight,
        defaultExpanded: data.defaultExpanded,
      })
    }
  },
})
