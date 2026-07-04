import { defineComponent, h } from 'vue'
import { Box } from '../../../core'
import classes from '../Loader.module.css'

export const Bars = defineComponent({
  name: 'Bars',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Box, { ...attrs, component: 'span', class: [classes.barsLoader, attrs.class] }, () => [
        h('span', { class: classes.bar }),
        h('span', { class: classes.bar }),
        h('span', { class: classes.bar }),
      ])
  },
})
