import { defineComponent, h, ref, watch, type PropType } from 'vue'
import { clampUseMovePosition, useMove } from '@mantine-vue/hooks'
import { Box, useMantineTheme, useStyles } from '../../../core'
import { useColorPickerContext } from '../ColorPicker.context'
import { Thumb } from '../Thumb/Thumb'
import classes from '../ColorPicker.module.css'
export type ColorSliderStylesNames = 'slider' | 'sliderOverlay' | 'thumb'
export const ColorSlider = defineComponent({
  name: 'ColorSlider',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
    onChange: { type: Function as PropType<(value: number) => void>, default: undefined },
    onChangeEnd: { type: Function as PropType<(value: number) => void>, default: undefined },
    onScrubStart: { type: Function as PropType<() => void>, default: undefined },
    onScrubEnd: { type: Function as PropType<() => void>, default: undefined },
    size: { type: String, default: 'md' },
    focusable: { type: Boolean, default: true },
    maxValue: { type: Number, required: true },
    overlays: { type: Array as PropType<Record<string, any>[]>, required: true },
    round: { type: Boolean, required: true },
    thumbColor: { type: String, default: 'transparent' },
    __staticSelector: { type: String, default: 'ColorPicker' },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    const ctx = useColorPickerContext()
    const theme = useMantineTheme()
    const position = ref({ x: props.value / props.maxValue, y: 0 })
    const positionRef = ref(position.value)
    const ownStyles = useStyles({
      name: props.__staticSelector,
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
    })
    const getStyles = ctx?.getStyles ?? ownStyles
    const changeValue = (value: number) =>
      props.round ? Math.round(value * props.maxValue) : value * props.maxValue
    const move = useMove<HTMLDivElement>(
      ({ x, y }) => {
        positionRef.value = { x, y }
        position.value = { x, y: 0 }
        props.onChange?.(changeValue(x))
      },
      {
        onScrubStart: props.onScrubStart,
        onScrubEnd: () => {
          props.onChangeEnd?.(changeValue(positionRef.value.x))
          props.onScrubEnd?.()
        },
      },
    )
    watch(
      () => props.value,
      (value) => (position.value = { x: value / props.maxValue, y: 0 }),
    )
    const keydown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      const next = clampUseMovePosition({
        x: position.value.x + (event.key === 'ArrowRight' ? 0.05 : -0.05),
        y: 0,
      })
      const value = changeValue(next.x)
      props.onChange?.(value)
      props.onChangeEnd?.(value)
    }
    return () =>
      h(
        Box,
        {
          ...attrs,
          ref: (node: any) => move.ref(node?.$el ?? node),
          ...getStyles('slider', { className: attrs.class, style: attrs.style }),
          role: 'slider',
          'aria-valuenow': props.value,
          'aria-valuemax': props.maxValue,
          'aria-valuemin': 0,
          tabindex: props.focusable ? 0 : -1,
          onKeydown: keydown,
          'data-focus-ring': theme.value.focusRing,
          style: [
            getStyles('slider').style,
            { '--cp-thumb-size': `var(--cp-thumb-size-${props.size})` },
            attrs.style,
          ],
        },
        () => [
          ...props.overlays.map((overlay, index) =>
            h('div', {
              ...getStyles('sliderOverlay'),
              style: [getStyles('sliderOverlay').style, overlay],
              key: index,
            }),
          ),
          h(Thumb, {
            position: position.value,
            ...getStyles('thumb'),
            style: [getStyles('thumb').style, { top: '0.0625rem', background: props.thumbColor }],
          }),
        ],
      )
  },
})
Object.assign(ColorSlider, { classes })
