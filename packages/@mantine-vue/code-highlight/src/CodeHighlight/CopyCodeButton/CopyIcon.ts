import { defineComponent, h } from 'vue'

export const CopyIcon = defineComponent({
  name: 'CopyIcon',
  inheritAttrs: false,
  props: {
    copied: { type: Boolean, required: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        {
          ...attrs,
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          strokeWidth: '2',
          stroke: 'currentColor',
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        props.copied
          ? [
              h('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
              h('path', { d: 'M5 12l5 5l10 -10' }),
            ]
          : [
              h('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
              h('path', {
                d: 'M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z',
              }),
              h('path', {
                d: 'M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2',
              }),
            ],
      )
  },
})
