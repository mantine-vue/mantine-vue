import { defineComponent, h } from 'vue'

export const EyeDropperIcon = defineComponent({
  name: 'EyeDropperIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          style: {
            width: 'var(--ci-eye-dropper-icon-size)',
            height: 'var(--ci-eye-dropper-icon-size)',
            ...(attrs.style as Record<string, any> | undefined),
          },
          viewBox: '0 0 24 24',
          strokeWidth: '1.5',
          stroke: 'currentColor',
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          ...attrs,
        },
        [
          h('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
          h('path', { d: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' }),
          h('path', { d: 'M12 3l0 4' }),
          h('path', { d: 'M12 21l0 -3' }),
          h('path', { d: 'M3 12l4 0' }),
          h('path', { d: 'M21 12l-3 0' }),
          h('path', { d: 'M12 12l0 .01' }),
        ],
      )
  },
})
