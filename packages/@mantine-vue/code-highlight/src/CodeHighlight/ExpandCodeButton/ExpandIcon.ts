import { defineComponent, h } from 'vue'

export const ExpandIcon = defineComponent({
  name: 'ExpandIcon',
  inheritAttrs: false,
  props: {
    expanded: { type: Boolean, required: true },
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
        props.expanded
          ? [
              h('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
              h('path', { d: 'M12 13v-8l-3 3m6 0l-3 -3' }),
              h('path', { d: 'M9 17l1 0' }),
              h('path', { d: 'M14 17l1 0' }),
              h('path', { d: 'M19 17l1 0' }),
              h('path', { d: 'M4 17l1 0' }),
            ]
          : [
              h('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
              h('path', { d: 'M12 11v8l3 -3m-6 0l3 3' }),
              h('path', { d: 'M9 7l1 0' }),
              h('path', { d: 'M14 7l1 0' }),
              h('path', { d: 'M19 7l1 0' }),
              h('path', { d: 'M4 7l1 0' }),
            ],
      )
  },
})
