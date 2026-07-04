import { defineComponent, h, ref, watch, type PropType } from 'vue'
import { clampUseMovePosition, useMove } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useColorPickerContext } from '../ColorPicker.context'
import type { HsvaColor } from '../ColorPicker.types'
import { convertHsvaTo } from '../converters'
import { Thumb } from '../Thumb/Thumb'
export const Saturation = defineComponent({
  name: 'Saturation',
  inheritAttrs: false,
  props: {
    value: { type: Object as PropType<HsvaColor>, required: true },
    onChange: { type: Function as PropType<(color: Partial<HsvaColor>) => void>, required: true },
    onChangeEnd: {
      type: Function as PropType<(color: Partial<HsvaColor>) => void>,
      required: true,
    },
    onScrubStart: { type: Function as PropType<() => void>, default: undefined },
    onScrubEnd: { type: Function as PropType<() => void>, default: undefined },
    saturationLabel: { type: String, default: undefined },
    size: { type: String, required: true },
    color: { type: String, required: true },
    focusable: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    const ctx = useColorPickerContext()!
    const position = ref({ x: props.value.s / 100, y: 1 - props.value.v / 100 })
    const positionRef = ref(position.value)
    const move = useMove<HTMLDivElement>(
      ({ x, y }) => {
        position.value = { x, y }
        positionRef.value = { x, y }
        props.onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) })
      },
      {
        onScrubStart: props.onScrubStart,
        onScrubEnd: () => {
          const { x, y } = positionRef.value
          props.onChangeEnd({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) })
          props.onScrubEnd?.()
        },
      },
    )
    watch(
      () => [props.value.s, props.value.v],
      () => (position.value = { x: props.value.s / 100, y: 1 - props.value.v / 100 }),
    )
    const keydown = (event: KeyboardEvent) => {
      const delta = 0.05
      let next = { ...position.value }
      if (event.key === 'ArrowUp') next.y -= delta
      else if (event.key === 'ArrowDown') next.y += delta
      else if (event.key === 'ArrowRight') next.x += delta
      else if (event.key === 'ArrowLeft') next.x -= delta
      else return
      event.preventDefault()
      next = clampUseMovePosition(next)
      const color = { s: Math.round(next.x * 100), v: Math.round((1 - next.y) * 100) }
      props.onChange(color)
      props.onChangeEnd(color)
    }
    return () =>
      h(
        Box,
        {
          ...attrs,
          ...ctx.getStyles('saturation'),
          ref: (node: any) => move.ref(node?.$el ?? node),
          role: 'slider',
          'aria-label': props.saturationLabel,
          'aria-valuenow': position.value.x,
          'aria-valuetext': convertHsvaTo('rgba', props.value),
          tabindex: props.focusable ? 0 : -1,
          onKeydown: keydown,
        },
        () => [
          h(
            'div',
            ctx.getStyles('saturationOverlay', {
              style: { backgroundColor: `hsl(${props.value.h}, 100%, 50%)` },
            }),
          ),
          h(
            'div',
            ctx.getStyles('saturationOverlay', {
              style: { backgroundImage: 'linear-gradient(90deg,#fff,transparent)' },
            }),
          ),
          h(
            'div',
            ctx.getStyles('saturationOverlay', {
              style: { backgroundImage: 'linear-gradient(0deg,#000,transparent)' },
            }),
          ),
          h(Thumb, {
            position: position.value,
            ...ctx.getStyles('thumb', { style: { backgroundColor: props.color } }),
          }),
        ],
      )
  },
})
