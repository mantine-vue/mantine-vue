import {
  computed,
  defineComponent,
  h,
  ref,
  watch,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { useMove, useUncontrolled } from '@mantine-vue/hooks'
import {
  createVarsResolver,
  getRadius,
  getSize,
  getThemeColor,
  rem,
  useDirection,
  useProps,
  useStyles,
} from '../../../core'
import { provideSliderContext } from '../Slider.context'
import type { SliderMark } from '../SliderMark'
import { SliderRoot } from '../SliderRoot/SliderRoot'
import { Thumb } from '../Thumb/Thumb'
import { Track } from '../Track/Track'
import {
  clamp,
  findClosest,
  getChangeValue,
  getFloatingValue,
  getNextMarkValue,
  getPosition,
  getPrecision,
  getPreviousMarkValue,
} from '../utils/slider-utils'
import classes from '../Slider.module.css'
export type RangeSliderValue = [number, number]
const defaults = {
  min: 0,
  max: 100,
  step: 1,
  minRange: 10,
  maxRange: Infinity,
  pushOnOverlap: true,
  marks: [],
  label: (value: number) => value,
  showLabelOnHover: true,
  scale: (value: number) => value,
  size: 'md',
  radius: 'xl',
  orientation: 'horizontal',
} as const
const varsResolver = createVarsResolver<any>((theme, { size, color, thumbSize, radius }) => ({
  root: {
    '--slider-size': getSize(size, 'slider-size'),
    '--slider-color': color ? getThemeColor(color, theme) : undefined,
    '--slider-radius': getRadius(radius),
    '--slider-thumb-size':
      thumbSize !== undefined ? rem(thumbSize) : 'calc(var(--slider-size) * 2)',
  },
}))
export interface RangeSliderSlots {
  label?: (payload: { value: number; index: number }) => VNodeChild
  thumbChildren?: (payload: { index: number }) => VNodeChild
}

export const RangeSlider = defineComponent({
  name: 'RangeSlider',
  inheritAttrs: false,
  slots: Object as SlotsType<RangeSliderSlots>,
  props: {
    value: { type: Array as unknown as PropType<RangeSliderValue>, default: undefined },
    defaultValue: { type: Array as unknown as PropType<RangeSliderValue>, default: undefined },
    onChange: { type: Function as PropType<(value: RangeSliderValue) => void>, default: undefined },
    onChangeEnd: {
      type: Function as PropType<(value: RangeSliderValue) => void>,
      default: undefined,
    },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    domain: { type: Array as unknown as PropType<RangeSliderValue>, default: undefined },
    step: { type: Number, default: undefined },
    precision: { type: Number, default: undefined },
    minRange: { type: Number, default: undefined },
    maxRange: { type: Number, default: undefined },
    pushOnOverlap: { type: Boolean, default: undefined },
    marks: { type: Array as PropType<SliderMark[]>, default: undefined },
    restrictToMarks: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    labelAlwaysOn: { type: Boolean, default: false },
    showLabelOnHover: { type: Boolean, default: undefined },
    thumbLabel: { type: Array as unknown as PropType<[string, string]>, default: undefined },
    thumbValueText: { type: [String, Function] as PropType<any>, default: undefined },
    thumbChildren: { type: Array as PropType<any[]>, default: undefined },
    thumbProps: {
      type: Function as PropType<(index: number) => Record<string, any>>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    inverted: { type: Boolean, default: false },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
    scale: { type: Function as PropType<(value: number) => number>, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    color: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    thumbSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('RangeSlider', defaults as any, rawProps) as any
    const direction = useDirection()
    const activeThumb = ref(0)
    const focused = ref(0)
    const hovered = ref(false)
    const [current, setCurrent] = useUncontrolled<RangeSliderValue>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: [props.min, props.max],
      onChange: (value) => props.onChange?.(value),
    })
    const valueRef = ref<RangeSliderValue>([...current.value])
    watch(current, (value) => (valueRef.value = [...value]))
    const precision = computed(() => props.precision ?? getPrecision(props.step))
    const domain = computed(() => props.domain ?? ([props.min, props.max] as RangeSliderValue))
    const getStyles = useStyles({
      name: 'RangeSlider',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
      varsResolver,
    })
    provideSliderContext({ getStyles })
    const setAt = (raw: number, index: number, end = false) => {
      if (props.disabled) return
      const next = [...valueRef.value] as RangeSliderValue
      let value = getChangeValue({
        value: raw,
        min: domain.value[0],
        max: domain.value[1],
        step: props.step,
        precision: precision.value,
      })
      if (props.restrictToMarks)
        value = findClosest(
          value,
          props.marks.map((mark: SliderMark) => mark.value),
        )
      value = clamp(value, props.min, props.max)
      const other = index === 0 ? 1 : 0
      if (index === 0 && value > next[1] - props.minRange) {
        if (props.pushOnOverlap) next[1] = clamp(value + props.minRange, props.min, props.max)
        else value = next[0]
      }
      if (index === 1 && value < next[0] + props.minRange) {
        if (props.pushOnOverlap) next[0] = clamp(value - props.minRange, props.min, props.max)
        else value = next[1]
      }
      if (Math.abs(value - next[other]) > props.maxRange) {
        if (props.pushOnOverlap)
          next[other] = value + (index === 0 ? props.maxRange : -props.maxRange)
        else value = next[index]
      }
      next[index] = getFloatingValue(value, precision.value)
      next.sort((a, b) => a - b)
      setCurrent(next)
      valueRef.value = next
      if (end) props.onChangeEnd?.(next)
    }
    const move = useMove<HTMLDivElement>(
      ({ x, y }) => setAt(props.orientation === 'vertical' ? 1 - y : x, activeThumb.value),
      { onScrubEnd: () => props.onChangeEnd?.(valueRef.value) },
      direction.dir.value,
    )
    const keydown = (index: number, event: KeyboardEvent) => {
      const increase = event.key === 'ArrowUp' || event.key === 'ArrowRight'
      const decrease = event.key === 'ArrowDown' || event.key === 'ArrowLeft'
      if (!increase && !decrease) return
      event.preventDefault()
      let next = valueRef.value[index]
      next = props.restrictToMarks
        ? increase
          ? getNextMarkValue(next, props.marks)
          : getPreviousMarkValue(next, props.marks)
        : next + (increase ? props.step : -props.step)
      setAt((next - domain.value[0]) / (domain.value[1] - domain.value[0]), index, true)
    }
    return () => {
      const positions = current.value.map((value) =>
        getPosition({ value, min: domain.value[0], max: domain.value[1] }),
      ) as RangeSliderValue
      return h(
        SliderRoot,
        { ...attrs, size: props.size, disabled: props.disabled, orientation: props.orientation },
        () => [
          h(
            Track,
            {
              offset: positions[0],
              marksOffset: current.value[0],
              filled: positions[1] - positions[0],
              marks: props.marks,
              min: domain.value[0],
              max: domain.value[1],
              value: current.value[1],
              disabled: props.disabled,
              inverted: props.inverted,
              containerProps: {
                ref: (node: any) => move.ref(node?.$el ?? node),
                onMouseenter: () => (hovered.value = true),
                onMouseleave: () => (hovered.value = false),
                onMousedownCapture: (event: MouseEvent) => {
                  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
                  const ratio =
                    props.orientation === 'vertical'
                      ? (rect.bottom - event.clientY) / rect.height
                      : (event.clientX - rect.left) / rect.width
                  const value =
                    domain.value[0] + clamp(ratio, 0, 1) * (domain.value[1] - domain.value[0])
                  activeThumb.value =
                    Math.abs(current.value[0] - value) > Math.abs(current.value[1] - value) ? 1 : 0
                },
              },
            },
            {
              default: () =>
                [0, 1].map((index) =>
                  h(
                    Thumb,
                    {
                      ...props.thumbProps?.(index),
                      max: props.max,
                      min: props.min,
                      value: props.scale(current.value[index]),
                      position: positions[index],
                      dragging: move.active.value && activeThumb.value === index,
                      label: slots.label
                        ? slots.label({ value: props.scale(current.value[index]), index })
                        : typeof props.label === 'function'
                          ? props.label(props.scale(current.value[index]))
                          : props.label,
                      labelAlwaysOn: props.labelAlwaysOn,
                      thumbLabel: props.thumbLabel?.[index],
                      thumbValueText: props.thumbValueText,
                      showLabelOnHover: props.showLabelOnHover,
                      isHovered: hovered.value,
                      disabled: props.disabled,
                      orientation: props.orientation,
                      onMousedown: () => (activeThumb.value = index),
                      onFocus: () => (focused.value = index),
                      onKeydown: (event: KeyboardEvent) => keydown(index, event),
                    },
                    () =>
                      slots.thumbChildren
                        ? slots.thumbChildren({ index })
                        : props.thumbChildren?.[index],
                  ),
                ),
            },
          ),
          props.name
            ? [
                h('input', {
                  type: 'hidden',
                  name: `${props.name}_from`,
                  value: current.value[0],
                  ...props.hiddenInputProps,
                }),
                h('input', {
                  type: 'hidden',
                  name: `${props.name}_to`,
                  value: current.value[1],
                  ...props.hiddenInputProps,
                }),
              ]
            : null,
        ],
      )
    }
  },
})
Object.assign(RangeSlider, { classes, varsResolver })
