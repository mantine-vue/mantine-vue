import { defineComponent, h } from 'vue'
import { InputBase } from '../InputBase'

export const TextInput = defineComponent({
  name: 'TextInput',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        InputBase,
        {
          ...attrs,
          component: 'input',
          __staticSelector: 'TextInput',
          __stylesApiProps: attrs,
        },
        slots,
      )
  },
})

Object.assign(TextInput, { classes: InputBase.classes })
