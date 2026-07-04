import { computed, defineComponent, h, ref, watch, type PropType } from 'vue'
import { useMove, useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  createVarsResolver,
  getRadius,
  getSize,
  getThemeColor,
  rem,
  useDirection,
  useProps,
  useStyles,
} from '../../../core'
import { provideSliderContext, type SliderStylesNames } from '../Slider.context'
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

export type { SliderStylesNames }
const defaultProps = {
  radius: 'xl',
  min: 0,
  max: 100,
  step: 1,
  marks: [],
  label: (value: number) => value,
  thumbLabel: '',
  showLabelOnHover: true,
  scale: (value: number) => value,
  size: 'md',
  orientation: 'horizontal',
} as const
const varsResolver = createVarsResolver<any>((theme, { size, color, thumbSize, radius }) => ({
  root: {
    '--slider-size': getSize(size, 'slider-size'),
    '--slider-color': color ? getThemeColor(color, theme) : undefined,
    '--slider-radius': radius === undefined ? undefined : getRadius(radius),
    '--slider-thumb-size':
      thumbSize !== undefined ? rem(thumbSize) : 'calc(var(--slider-size) * 2)',
  },
}))

export const Slider = withBoxProps(
  defineComponent({
    name: 'Slider',
    inheritAttrs: false,
    props: {
      color: { type: String, default: undefined },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      min: { type: Number, default: undefined },
      max: { type: Number, default: undefined },
      domain: { type: Array as unknown as PropType<[number, number]>, default: undefined },
      step: { type: Number, default: undefined },
      precision: { type: Number, default: undefined },
      value: { type: Number, default: undefined },
      defaultValue: { type: Number, default: undefined },
      onChange: { type: Function as PropType<(value: number) => void>, default: undefined },
      onChangeEnd: { type: Function as PropType<(value: number) => void>, default: undefined },
      name: { type: String, default: undefined },
      marks: { type: Array as PropType<SliderMark[]>, default: undefined },
      label: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      labelTransitionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      labelAlwaysOn: { type: Boolean, default: false },
      thumbLabel: { type: String, default: undefined },
      thumbValueText: { type: [String, Function] as PropType<any>, default: undefined },
      showLabelOnHover: { type: Boolean, default: undefined },
      thumbChildren: {
        type: [String, Number, Object, Function] as PropType<any>,
        default: undefined,
      },
      disabled: { type: Boolean, default: false },
      thumbSize: { type: [String, Number] as PropType<string | number>, default: undefined },
      scale: { type: Function as PropType<(value: number) => number>, default: undefined },
      inverted: { type: Boolean, default: false },
      startPointValue: { type: Number, default: undefined },
      orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
      hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      restrictToMarks: { type: Boolean, default: false },
      thumbProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs }) {
      const props = useProps('Slider', defaultProps as any, rawProps) as any
      const direction = useDirection()
      const hovered = ref(false)
      const thumb = ref<HTMLElement | null>(null)
      const [current, setCurrent] = useUncontrolled<number>({
        value: () =>
          props.value === undefined ? undefined : clamp(props.value, props.min, props.max),
        defaultValue:
          props.defaultValue === undefined
            ? undefined
            : clamp(props.defaultValue, props.min, props.max),
        finalValue: clamp(0, props.min, props.max),
        onChange: (value) => props.onChange?.(value),
      })
      const valueRef = ref(current.value)
      watch(current, (value) => {
        valueRef.value = value
      })
      const precision = computed(() => props.precision ?? getPrecision(props.step))
      const domain = computed(() => props.domain ?? ([props.min, props.max] as [number, number]))
      const getStyles = useStyles({
        name: 'Slider',
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
      const update = (raw: number, end = false) => {
        if (props.disabled) return
        let next = getChangeValue({
          value: raw,
          min: domain.value[0],
          max: domain.value[1],
          step: props.step,
          precision: precision.value,
        })
        if (props.restrictToMarks)
          next = findClosest(
            next,
            props.marks.map((mark: SliderMark) => mark.value),
          )
        next = getFloatingValue(clamp(next, props.min, props.max), precision.value)
        setCurrent(next)
        valueRef.value = next
        if (end) props.onChangeEnd?.(next)
      }
      const move = useMove<HTMLDivElement>(
        ({ x, y }) => update(props.orientation === 'vertical' ? 1 - y : x),
        { onScrubEnd: () => !props.disabled && props.onChangeEnd?.(valueRef.value) },
        direction.dir.value,
      )
      const keydown = (event: KeyboardEvent) => {
        if (props.disabled) return
        let next = valueRef.value
        const increase =
          event.key === 'ArrowUp' ||
          (event.key === 'ArrowRight' && direction.dir.value === 'ltr') ||
          (event.key === 'ArrowLeft' && direction.dir.value === 'rtl')
        const decrease =
          event.key === 'ArrowDown' ||
          (event.key === 'ArrowLeft' && direction.dir.value === 'ltr') ||
          (event.key === 'ArrowRight' && direction.dir.value === 'rtl')
        if (!increase && !decrease) return
        event.preventDefault()
        next = props.restrictToMarks
          ? increase
            ? getNextMarkValue(next, props.marks)
            : getPreviousMarkValue(next, props.marks)
          : next + (increase ? props.step : -props.step)
        update(
          (clamp(next, domain.value[0], domain.value[1]) - domain.value[0]) /
            (domain.value[1] - domain.value[0]),
          true,
        )
      }
      return () => {
        const position = getPosition({
          value: current.value,
          min: domain.value[0],
          max: domain.value[1],
        })
        const scaled = props.scale(current.value)
        const label = typeof props.label === 'function' ? props.label(scaled) : props.label
        const start =
          typeof props.startPointValue === 'number' && !props.inverted
            ? getPosition({
                value: props.startPointValue,
                min: domain.value[0],
                max: domain.value[1],
              })
            : 0
        return h(
          SliderRoot,
          { ...attrs, size: props.size, disabled: props.disabled, orientation: props.orientation },
          () => [
            h(
              Track,
              {
                filled: Math.abs(position - start),
                offset: Math.min(position, start),
                marks: props.marks,
                min: domain.value[0],
                max: domain.value[1],
                value: current.value,
                disabled: props.disabled,
                inverted: props.inverted,
                startPointValue: props.startPointValue,
                containerProps: {
                  ref: (node: any) => move.ref(node?.$el ?? node),
                  onMouseenter: () => (hovered.value = true),
                  onMouseleave: () => (hovered.value = false),
                },
              },
              {
                default: () =>
                  h(
                    Thumb,
                    {
                      ...props.thumbProps,
                      ref: (node: any) => (thumb.value = node?.$el ?? node),
                      max: props.max,
                      min: props.min,
                      value: scaled,
                      position,
                      dragging: move.active.value,
                      label,
                      labelTransitionProps: props.labelTransitionProps,
                      labelAlwaysOn: props.labelAlwaysOn,
                      thumbLabel: props.thumbLabel,
                      thumbValueText: props.thumbValueText,
                      showLabelOnHover: props.showLabelOnHover,
                      isHovered: hovered.value,
                      disabled: props.disabled,
                      orientation: props.orientation,
                      onKeydown: keydown,
                    },
                    () => props.thumbChildren,
                  ),
              },
            ),
            props.name
              ? h('input', {
                  type: 'hidden',
                  name: props.name,
                  value: current.value,
                  ...props.hiddenInputProps,
                })
              : null,
          ],
        )
      }
    },
  }),
)
Object.assign(Slider, { classes, varsResolver })
