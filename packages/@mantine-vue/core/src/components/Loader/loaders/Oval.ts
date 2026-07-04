import { defineComponent, h } from 'vue'
import { Box } from '../../../core'
import classes from '../Loader.module.css'

export const Oval = defineComponent({
  name: 'Oval',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(Box, { ...attrs, component: 'span', class: [classes.ovalLoader, attrs.class] })
  },
})
