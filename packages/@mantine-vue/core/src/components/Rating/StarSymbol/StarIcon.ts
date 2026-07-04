import { defineComponent, h } from 'vue'

export const StarIcon = defineComponent({
  name: 'StarIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        {
          ...attrs,
          viewBox: '0 0 24 24',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        h('path', {
          d: 'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z',
        }),
      )
  },
})
