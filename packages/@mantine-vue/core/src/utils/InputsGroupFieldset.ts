import { defineComponent, h } from 'vue'
import { Box } from '../core'

export const InputsGroupFieldset = defineComponent({
  name: 'InputsGroupFieldset',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        Box,
        {
          ...attrs,
          component: 'fieldset',
          style: [{ border: 0, padding: 0, margin: 0, minWidth: 0 }, attrs.style as any],
        },
        () => slots.default?.(),
      )
  },
})
