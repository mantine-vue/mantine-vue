import { defineComponent, h, type PropType } from 'vue'
import { useRatingContext } from '../Rating.context'
import { StarIcon } from './StarIcon'

export const StarSymbol = defineComponent({
  name: 'StarSymbol',
  props: {
    type: { type: String as PropType<'empty' | 'full'>, required: true },
  },
  setup(props) {
    const ctx = useRatingContext()

    return () =>
      h(StarIcon, {
        ...ctx.getStyles('starSymbol'),
        'data-filled': props.type === 'full' ? true : undefined,
      })
  },
})
