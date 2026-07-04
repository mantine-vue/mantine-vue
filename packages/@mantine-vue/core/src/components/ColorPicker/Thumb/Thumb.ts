import { defineComponent, h, type PropType } from 'vue'
import { Box } from '../../../core'
export const Thumb = defineComponent({
  name: 'ColorPickerThumb',
  inheritAttrs: false,
  props: { position: { type: Object as PropType<{ x: number; y: number }>, required: true } },
  setup(props, { attrs }) {
    return () =>
      h(Box, {
        ...attrs,
        style: [
          attrs.style,
          {
            '--thumb-y-offset': `${props.position.y * 100}%`,
            '--thumb-x-offset': `${props.position.x * 100}%`,
          },
        ],
      })
  },
})
