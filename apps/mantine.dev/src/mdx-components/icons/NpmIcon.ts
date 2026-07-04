import { defineComponent, h, type PropType } from 'vue'
import { Box, rem } from '@mantine-vue/core'

export const NpmIcon = defineComponent({
  name: 'NpmIcon',
  inheritAttrs: false,
  props: {
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        Box,
        {
          ...attrs,
          component: 'svg',
          preserveAspectRatio: 'xMidYMid',
          viewBox: '0 0 256 256',
          xmlns: 'http://www.w3.org/2000/svg',
          style: [{ width: rem(props.size), height: rem(props.size) }, (attrs as any).style],
        },
        () => [
          h('path', { d: 'M0 256V0h256v256z', fill: '#C12127' }),
          h('path', { d: 'M48 48h160v160h-32V80h-48v128H48z', fill: '#FFF' }),
        ],
      )
  },
})
