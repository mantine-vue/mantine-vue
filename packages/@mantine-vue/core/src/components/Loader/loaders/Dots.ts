import { defineComponent, h } from 'vue'
import { Box } from '../../../core'
import classes from '../Loader.module.css'

export const Dots = defineComponent({
  name: 'Dots',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Box, { ...attrs, component: 'span', class: [classes.dotsLoader, attrs.class] }, () => [
        h('span', { class: classes.dot }),
        h('span', { class: classes.dot }),
        h('span', { class: classes.dot }),
      ])
  },
})
