import { defineComponent, h, type PropType } from 'vue'
import { Box } from '../../../core'
import { Marks } from '../Marks/Marks'
import type { SliderMark } from '../SliderMark'
import { useSliderContext } from '../Slider.context'

export const Track = defineComponent({
  name: 'SliderTrack',
  inheritAttrs: false,
  props: {
    filled: { type: Number, required: true },
    offset: { type: Number, default: 0 },
    marksOffset: { type: Number, default: undefined },
    marks: { type: Array as PropType<SliderMark[]>, default: undefined },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    value: { type: Number, required: true },
    startPointValue: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
    inverted: { type: Boolean, default: false },
    containerProps: { type: Object as PropType<Record<string, any>>, default: undefined },
  },
  setup(props, { slots }) {
    const ctx = useSliderContext()
    return () =>
      h(
        Box,
        {
          ...props.containerProps,
          ...ctx.getStyles('trackContainer'),
          mod: { disabled: props.disabled },
        },
        () =>
          h(
            Box,
            {
              ...ctx.getStyles('track'),
              mod: { inverted: props.inverted, disabled: props.disabled },
            },
            () => [
              h(Box, {
                ...ctx.getStyles('bar'),
                mod: { inverted: props.inverted, disabled: props.disabled },
                style: [
                  ctx.getStyles('bar').style,
                  {
                    '--slider-bar-width': `calc(${props.filled}% + 2 * var(--slider-size))`,
                    '--slider-bar-offset': `calc(${props.offset}% - var(--slider-size))`,
                  },
                ],
              }),
              slots.default?.(),
              h(Marks, {
                marks: props.marks,
                min: props.min,
                max: props.max,
                value: props.value,
                offset: props.marksOffset,
                disabled: props.disabled,
                inverted: props.inverted,
                startPointValue: props.startPointValue,
              }),
            ],
          ),
      )
  },
})
