import { defineComponent, h, type PropType } from 'vue'
import { Box } from '../../../core'
import { useSliderContext } from '../Slider.context'
import type { SliderMark } from '../SliderMark'
import { getPosition, isMarkFilled } from '../utils/slider-utils'

export const Marks = defineComponent({
  name: 'SliderMarks',
  props: {
    marks: { type: Array as PropType<SliderMark[]>, default: undefined },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    value: { type: Number, required: true },
    offset: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
    inverted: { type: Boolean, default: false },
    startPointValue: { type: Number, default: undefined },
  },
  setup(props) {
    const ctx = useSliderContext()
    return () =>
      props.marks
        ? h(
            'div',
            props.marks.map((mark, index) =>
              mark.hidden
                ? null
                : h(
                    Box,
                    {
                      ...ctx.getStyles('markWrapper'),
                      key: index,
                      style: [
                        ctx.getStyles('markWrapper').style,
                        {
                          '--mark-offset': `${getPosition({ value: mark.value, min: props.min, max: props.max })}%`,
                        },
                      ],
                    },
                    () => [
                      h(Box, {
                        ...ctx.getStyles('mark'),
                        mod: {
                          filled: isMarkFilled({
                            mark,
                            value: props.value,
                            offset: props.offset,
                            inverted: props.inverted,
                            startPointValue: props.startPointValue,
                          }),
                          disabled: props.disabled,
                        },
                      }),
                      mark.label != null ? h('div', ctx.getStyles('markLabel'), mark.label) : null,
                    ],
                  ),
            ),
          )
        : null
  },
})
