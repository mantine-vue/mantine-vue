import { defineComponent, h } from 'vue'

const paths = {
  vertical: [
    'M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
  ],
  horizontal: [
    'M4 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M4 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M11 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M11 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M18 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M18 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
  ],
}

function createGripIcon(name: string, direction: keyof typeof paths) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            ...attrs,
          },
          paths[direction].map((d) => h('path', { d })),
        )
    },
  })
}

export const GripVerticalIcon = createGripIcon('GripVerticalIcon', 'vertical')
export const GripHorizontalIcon = createGripIcon('GripHorizontalIcon', 'horizontal')
