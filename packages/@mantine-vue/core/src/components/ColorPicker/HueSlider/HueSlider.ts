import { defineComponent, h, type PropType } from 'vue'
import { rem } from '../../../core'
import { ColorSlider } from '../ColorSlider/ColorSlider'
export const HueSlider = defineComponent({
  name: 'HueSlider',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
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
        __staticSelector: 'HueSlider',
        maxValue: 360,
        thumbColor: `hsl(${props.value}, 100%, 50%)`,
        round: true,
        'data-hue': '',
        overlays: [
          {
            backgroundImage:
              'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(170,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))',
          },
          {
            boxShadow: `rgba(0,0,0,.1) 0 0 0 ${rem(1)} inset, rgba(0,0,0,.15) 0 0 ${rem(4)} inset`,
          },
        ],
      })
  },
})
Object.assign(HueSlider, { classes: ColorSlider.classes })
