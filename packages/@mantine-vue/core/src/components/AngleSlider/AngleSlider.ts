import { defineComponent, h, ref, type PropType } from 'vue'
import { normalizeRadialValue, useRadialMove, useUncontrolled } from '@mantine-vue/hooks'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  findClosestNumber,
  rem,
  useProps,
  useStyles,
} from '../../core'
import classes from './AngleSlider.module.css'

export type AngleSliderStylesNames = 'root' | 'thumb' | 'label' | 'marks' | 'mark'
export type AngleSliderCssVariables = {
  root: '--slider-size' | '--thumb-size'
}

export interface AngleSliderMark {
  value: number
  label?: string
}

export interface AngleSliderProps {
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
  onScrubStart?: () => void
  onScrubEnd?: () => void
  withLabel?: boolean
  marks?: AngleSliderMark[]
  size?: number
  thumbSize?: number
  formatLabel?: (value: number) => any
  disabled?: boolean
  restrictToMarks?: boolean
  hiddenInputProps?: Record<string, any>
  name?: string
  classNames?: Record<string, string> | ((theme: any, props: any) => Record<string, string>)
  styles?: Record<string, any> | ((theme: any, props: any) => Record<string, any>)
  vars?:
    | Record<string, Record<string, string | undefined>>
    | ((theme: any, props: any) => Record<string, Record<string, string | undefined>>)
  unstyled?: boolean
}

const defaultProps = {
  step: 1,
  withLabel: true,
} as const

const varsResolver = createVarsResolver<any>((_, { size, thumbSize }) => ({
  root: {
    '--slider-size': size === undefined ? undefined : rem(size),
    '--thumb-size': thumbSize === undefined ? undefined : rem(thumbSize),
  },
}))

export const AngleSlider = withBoxProps(
  defineComponent({
    name: 'AngleSlider',
    inheritAttrs: false,
    props: {
      step: { type: Number, default: undefined },
      value: { type: Number, default: undefined },
      defaultValue: { type: Number, default: undefined },
      onChange: { type: Function as PropType<(value: number) => void>, default: undefined },
      onChangeEnd: { type: Function as PropType<(value: number) => void>, default: undefined },
      onScrubStart: { type: Function as PropType<() => void>, default: undefined },
      onScrubEnd: { type: Function as PropType<() => void>, default: undefined },
      withLabel: { type: Boolean, default: undefined },
      marks: { type: Array as PropType<AngleSliderMark[]>, default: undefined },
      size: { type: Number, default: undefined },
      thumbSize: { type: Number, default: undefined },
      formatLabel: { type: Function as PropType<(value: number) => any>, default: undefined },
      disabled: { type: Boolean, default: false },
      restrictToMarks: { type: Boolean, default: false },
      hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      name: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs }) {
      const props = useProps('AngleSlider', defaultProps, rawProps)
      const rootRef = ref<HTMLDivElement | null>(null)
      const [value, setValue] = useUncontrolled<number>({
        value: () => props.value,
        defaultValue: props.defaultValue,
        finalValue: 0,
        onChange: props.onChange,
      })

      const update = (nextValue: number) => {
        if (!rootRef.value || props.disabled) {
          return
        }

        const resolved =
          props.restrictToMarks && Array.isArray(props.marks)
            ? findClosestNumber(
                nextValue,
                props.marks.map((mark) => mark.value),
              )
            : nextValue

        setValue(resolved)
      }

      const radialMove = useRadialMove(update, {
        step: props.step,
        onChangeEnd: props.onChangeEnd,
        onScrubStart: props.onScrubStart,
        onScrubEnd: props.onScrubEnd,
      })

      const getStyles = useStyles({
        name: 'AngleSlider',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        varsResolver,
        unstyled: props.unstyled,
      })

      const setRootRef = (node: any) => {
        const element = node?.$el ?? node ?? null
        rootRef.value = element
        radialMove.ref(element)
      }

      const setKeyboardValue = (nextValue: number) => {
        const resolved =
          props.restrictToMarks && Array.isArray(props.marks)
            ? findClosestNumber(
                nextValue,
                props.marks.map((mark) => mark.value),
              )
            : nextValue

        setValue(resolved)
        props.onChangeEnd?.(resolved)
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (props.disabled) {
          return
        }

        const step = props.step ?? defaultProps.step
        let nextValue = value.value

        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
          event.preventDefault()
          nextValue = value.value === 0 ? 359 : normalizeRadialValue(value.value - step, step)
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
          event.preventDefault()
          nextValue = value.value === 359 ? 0 : normalizeRadialValue(value.value + step, step)
        }

        if (event.key === 'Home') {
          nextValue = 0
        }

        if (event.key === 'End') {
          nextValue = 359
        }

        if (props.restrictToMarks && Array.isArray(props.marks)) {
          const markValues = props.marks.map((mark) => mark.value)
          const currentIndex = markValues.indexOf(value.value)

          if (currentIndex !== -1) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
              nextValue = markValues[currentIndex === 0 ? markValues.length - 1 : currentIndex - 1]
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
              nextValue = markValues[currentIndex === markValues.length - 1 ? 0 : currentIndex + 1]
            } else {
              nextValue = findClosestNumber(nextValue, markValues)
            }
          } else {
            nextValue = findClosestNumber(nextValue, markValues)
          }
        }

        setKeyboardValue(nextValue)
      }

      return () => {
        const marks = props.marks?.map((mark, index) =>
          h('div', {
            key: index,
            ...getStyles('mark', { style: { '--angle': `${mark.value}deg` } }),
            'data-label': mark.label || undefined,
          }),
        )

        return h(
          Box,
          {
            ...attrs,
            ref: setRootRef,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            mod: { disabled: props.disabled },
          },
          () => [
            marks && marks.length > 0 ? h('div', getStyles('marks'), marks) : null,
            props.withLabel
              ? h(
                  'div',
                  getStyles('label'),
                  props.formatLabel ? props.formatLabel(value.value) : value.value,
                )
              : null,
            h('div', {
              tabindex: attrs.tabindex ?? (props.disabled ? -1 : 0),
              role: 'slider',
              'aria-valuemax': 360,
              'aria-valuemin': 0,
              'aria-valuenow': value.value,
              'aria-label': attrs['aria-label'],
              onKeydown: handleKeyDown,
              ...getStyles('thumb', { style: { transform: `rotate(${value.value}deg)` } }),
            }),
            h('input', {
              ...props.hiddenInputProps,
              type: 'hidden',
              name: props.name,
              value: value.value,
            }),
          ],
        )
      }
    },
  }),
)

Object.assign(AngleSlider, { classes, varsResolver })
