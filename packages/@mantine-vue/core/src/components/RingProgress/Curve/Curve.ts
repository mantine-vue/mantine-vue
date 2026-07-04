import { defineComponent, h, type PropType } from 'vue'
import { Box, getThemeColor, useMantineTheme } from '../../../core'
import { getCurveProps } from './get-curve-props'

export const Curve = defineComponent({
  name: 'RingProgressCurve',
  inheritAttrs: false,
  props: {
    value: { type: Number, default: undefined },
    size: { type: Number, required: true },
    offset: { type: Number, required: true },
    sum: { type: Number, required: true },
    thickness: { type: Number, required: true },
    lineRoundCaps: { type: Boolean, default: undefined },
    root: { type: Boolean, default: false },
    color: { type: String, default: undefined },
    getStyles: {
      type: Function as PropType<(selector: string, options?: any) => Record<string, any>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const theme = useMantineTheme()

    return () =>
      h(Box, {
        ...attrs,
        component: 'circle',
        ...props.getStyles('curve', {
          style: {
            '--curve-color': props.color ? getThemeColor(props.color, theme.value) : undefined,
          },
        }),
        fill: 'none',
        'stroke-linecap': props.lineRoundCaps ? 'round' : 'butt',
        ...getCurveProps({
          sum: props.sum,
          size: props.size,
          thickness: props.thickness,
          value: props.value,
          offset: props.offset,
          root: props.root,
        }),
      })
  },
})
