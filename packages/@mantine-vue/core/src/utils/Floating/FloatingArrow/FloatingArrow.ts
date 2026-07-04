import { defineComponent, h, type PropType } from 'vue'
import { useDirection } from '../../../core'
import type { ArrowPosition, FloatingPosition } from '../types'
import { getArrowPositionStyles } from './get-arrow-position-styles'

export const FloatingArrow = defineComponent({
  name: 'FloatingArrow',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<FloatingPosition>, required: true },
    arrowSize: { type: Number, required: true },
    arrowOffset: { type: Number, required: true },
    arrowRadius: { type: Number, required: true },
    arrowPosition: { type: String as PropType<ArrowPosition>, required: true },
    arrowX: Number,
    arrowY: Number,
    visible: Boolean,
  },
  setup(props, { attrs }) {
    const { dir } = useDirection()
    return () =>
      props.visible
        ? h('div', {
            ...attrs,
            style: [attrs.style, getArrowPositionStyles({ ...props, dir: dir.value })],
          })
        : null
  },
})
