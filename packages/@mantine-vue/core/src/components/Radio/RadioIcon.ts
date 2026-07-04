import { defineComponent, h } from 'vue'

export const RadioIcon = defineComponent({
  name: 'RadioIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 5 5',
          'aria-hidden': true,
          ...attrs,
        },
        h('circle', { cx: '2.5', cy: '2.5', r: '2.5', fill: 'currentColor' }),
      )
  },
})
