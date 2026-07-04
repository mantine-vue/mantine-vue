import { defineComponent, h, ref, watch, type PropType } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { Box, createVarsResolver, getSize, getSpacing, useProps, useStyles } from '../../core'
import { ColorSwatch } from '../ColorSwatch'
import { AlphaSlider } from './AlphaSlider/AlphaSlider'
import { provideColorPickerContext } from './ColorPicker.context'
import type { ColorFormat, HsvaColor } from './ColorPicker.types'
import { convertHsvaTo, isColorValid, parseColor } from './converters'
import { HueSlider } from './HueSlider/HueSlider'
import { Saturation } from './Saturation/Saturation'
import { Swatches } from './Swatches/Swatches'
import classes from './ColorPicker.module.css'
export type ColorPickerStylesNames =
  | 'wrapper'
  | 'preview'
  | 'body'
  | 'sliders'
  | 'slider'
  | 'sliderOverlay'
  | 'thumb'
  | 'saturation'
  | 'saturationOverlay'
  | 'swatches'
  | 'swatch'
const defaults = {
  swatchesPerRow: 7,
  withPicker: true,
  focusable: true,
  size: 'md',
  format: 'hex',
  __staticSelector: 'ColorPicker',
} as const
const varsResolver = createVarsResolver<any>((_, { size, swatchesPerRow }) => ({
  wrapper: {
    '--cp-preview-size': getSize(size, 'cp-preview-size'),
    '--cp-width': getSize(size, 'cp-width'),
    '--cp-body-spacing': getSpacing(size),
    '--cp-swatch-size': `${100 / swatchesPerRow}%`,
    '--cp-thumb-size': getSize(size, 'cp-thumb-size'),
    '--cp-saturation-height': getSize(size, 'cp-saturation-height'),
  },
}))
export const ColorPicker = defineComponent({
  name: 'ColorPicker',
  inheritAttrs: false,
  props: {
    value: { type: String, default: undefined },
    defaultValue: { type: String, default: undefined },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
    onChangeEnd: { type: Function as PropType<(value: string) => void>, default: undefined },
    format: { type: String as PropType<ColorFormat>, default: undefined },
    withPicker: { type: Boolean, default: undefined },
    swatches: { type: Array as PropType<string[]>, default: undefined },
    swatchesPerRow: { type: Number, default: undefined },
    size: { type: String, default: undefined },
    fullWidth: { type: Boolean, default: false },
    focusable: { type: Boolean, default: undefined },
    saturationLabel: { type: String, default: undefined },
    hueLabel: { type: String, default: undefined },
    alphaLabel: { type: String, default: undefined },
    onColorSwatchClick: { type: Function as PropType<(color: string) => void>, default: undefined },
    name: { type: String, default: undefined },
    hiddenInputProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    __staticSelector: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps('ColorPicker', defaults as any, rawProps) as any
    const [current, setCurrent, controlled] = useUncontrolled<string>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: '#FFFFFF',
      onChange: (value) => props.onChange?.(value),
    })
    const parsed = ref<HsvaColor>(parseColor(current.value))
    let scrubbing = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const getStyles = useStyles({
      name: props.__staticSelector,
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
    provideColorPickerContext({ getStyles, unstyled: props.unstyled })
    const output = (color: HsvaColor) => convertHsvaTo(props.format, color)
    const change = (partial: Partial<HsvaColor>) => {
      parsed.value = { ...parsed.value, ...partial }
      setCurrent(output(parsed.value))
    }
    watch(
      () => props.value,
      (value) => {
        if (typeof value === 'string' && isColorValid(value) && !scrubbing)
          parsed.value = parseColor(value)
      },
    )
    watch(
      () => props.format,
      () => setCurrent(output(parsed.value)),
    )
    const start = () => {
      clearTimeout(timer)
      scrubbing = true
    }
    const stop = () => {
      clearTimeout(timer)
      timer = setTimeout(() => (scrubbing = false), 200)
    }
    return () =>
      h(
        Box,
        {
          ...attrs,
          ...getStyles('wrapper', { className: attrs.class, style: attrs.style }),
          mod: [{ fullWidth: props.fullWidth }, props.mod],
        },
        () => [
          props.name
            ? h('input', {
                type: 'hidden',
                name: props.name,
                value: current.value,
                ...props.hiddenInputProps,
              })
            : null,
          props.withPicker
            ? [
                h(Saturation, {
                  value: parsed.value,
                  onChange: change,
                  onChangeEnd: (value: Partial<HsvaColor>) =>
                    props.onChangeEnd?.(output({ ...parsed.value, ...value })),
                  color: current.value,
                  size: props.size,
                  focusable: props.focusable,
                  saturationLabel: props.saturationLabel,
                  onScrubStart: start,
                  onScrubEnd: stop,
                }),
                h('div', getStyles('body'), [
                  h('div', getStyles('sliders'), [
                    h(HueSlider, {
                      value: parsed.value.h,
                      onChange: (hue: number) => change({ h: hue }),
                      onChangeEnd: (hue: number) =>
                        props.onChangeEnd?.(output({ ...parsed.value, h: hue })),
                      size: props.size,
                      focusable: props.focusable,
                      'aria-label': props.hueLabel,
                      onScrubStart: start,
                      onScrubEnd: stop,
                    }),
                    ['hexa', 'rgba', 'hsla'].includes(props.format)
                      ? h(AlphaSlider, {
                          value: parsed.value.a,
                          color: convertHsvaTo('hex', parsed.value),
                          onChange: (alpha: number) => change({ a: alpha }),
                          onChangeEnd: (alpha: number) =>
                            props.onChangeEnd?.(output({ ...parsed.value, a: alpha })),
                          size: props.size,
                          focusable: props.focusable,
                          'aria-label': props.alphaLabel,
                          onScrubStart: start,
                          onScrubEnd: stop,
                        })
                      : null,
                  ]),
                  ['hexa', 'rgba', 'hsla'].includes(props.format)
                    ? h(ColorSwatch, {
                        color: current.value,
                        radius: 'sm',
                        size: 'var(--cp-preview-size)',
                        ...getStyles('preview'),
                      })
                    : null,
                ]),
              ]
            : null,
          Array.isArray(props.swatches)
            ? h(Swatches, {
                data: props.swatches,
                focusable: props.focusable,
                value: current.value,
                setValue: (color: string) => {
                  const converted = output(parseColor(color))
                  setCurrent(converted)
                  if (!controlled.value) parsed.value = parseColor(color)
                },
                onChangeEnd: (color: string) => {
                  const converted = output(parseColor(color))
                  props.onColorSwatchClick?.(converted)
                  props.onChangeEnd?.(converted)
                },
              })
            : null,
        ],
      )
  },
})
Object.assign(ColorPicker, { classes, varsResolver })
