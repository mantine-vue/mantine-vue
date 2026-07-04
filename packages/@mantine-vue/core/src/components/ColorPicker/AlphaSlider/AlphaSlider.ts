import { defineComponent, h, type PropType } from 'vue'
import { rem } from '../../../core'
import { ColorSlider } from '../ColorSlider/ColorSlider'
import { round } from '../converters'
export const AlphaSlider = defineComponent({
  name: 'AlphaSlider',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
    color: { type: String, required: true },
    onChange: { type: Function as PropType<(value: number) => void>, default: undefined },
    onChangeEnd: { type: Function as PropType<(value: number) => void>, default: undefined },
    onScrubStart: { type: Function as PropType<() => void>, default: undefined },
    onScrubEnd: { type: Function as PropType<() => void>, default: undefined },
    size: { type: String, default: 'md' },
    focusable: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(ColorSlider, {
        ...attrs,
        ...props,
        __staticSelector: 'AlphaSlider',
        maxValue: 1,
        round: false,
        'data-alpha': '',
        onChange: (value: number) => props.onChange?.(round(value, 2)),
        onChangeEnd: (value: number) => props.onChangeEnd?.(round(value, 2)),
        overlays: [
          {
            backgroundImage:
              'linear-gradient(45deg,var(--slider-checkers) 25%,transparent 25%),linear-gradient(-45deg,var(--slider-checkers) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--slider-checkers) 75%)',
            backgroundSize: `${rem(8)} ${rem(8)}`,
          },
          { backgroundImage: `linear-gradient(90deg, transparent, ${props.color})` },
          { boxShadow: `rgba(0,0,0,.1) 0 0 0 ${rem(1)} inset` },
        ],
      })
  },
})
Object.assign(AlphaSlider, { classes: ColorSlider.classes })
