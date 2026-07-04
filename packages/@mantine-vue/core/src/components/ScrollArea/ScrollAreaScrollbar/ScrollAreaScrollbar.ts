import { defineComponent, h, type PropType } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import { ScrollAreaScrollbarVisible } from './ScrollAreaScrollbarVisible'

export const ScrollAreaScrollbar = defineComponent({
  name: 'ScrollAreaScrollbar',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      required: true,
    },
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const ctx = useScrollAreaContext()

    return () => {
      if (ctx.type === 'never') {
        return null
      }

      return h(
        ScrollAreaScrollbarVisible,
        {
          ...attrs,
          orientation: props.orientation,
          'data-state': attrs['data-state'] ?? (ctx.type === 'always' ? 'visible' : 'hidden'),
        },
        slots.default,
      )
    }
  },
})
