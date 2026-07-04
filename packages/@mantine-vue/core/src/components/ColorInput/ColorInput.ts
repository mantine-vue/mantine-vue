import { computed, defineComponent, h, ref, watch, type PropType } from 'vue'
import {
  ColorPicker,
  convertHsvaTo,
  isColorValid,
  parseColor,
  type ColorFormat,
} from '../ColorPicker'
import { ActionIcon } from '../ActionIcon'
import { ColorSwatch } from '../ColorSwatch'
import { InputBase } from '../InputBase'
import { Popover } from '../Popover'
import { EyeDropperIcon } from './EyeDropperIcon'
import classes from './ColorInput.module.css'

export interface ColorInputProps {
  modelValue?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onChangeEnd?: (value: string) => void
  format?: ColorFormat
  disallowInput?: boolean
  fixOnBlur?: boolean
  withPreview?: boolean
  withEyeDropper?: boolean
  popoverProps?: Record<string, any>
  closeOnColorSwatchClick?: boolean
  eyeDropperButtonProps?: Record<string, any>
  eyeDropperIcon?: any
  [key: string]: any
}

export const ColorInput = defineComponent({
  name: 'ColorInput',
  inheritAttrs: false,
  props: {
    modelValue: String,
    value: String,
    defaultValue: { type: String, default: '' },
    onChange: Function as PropType<(value: string) => void>,
    onChangeEnd: Function as PropType<(value: string) => void>,
    format: { type: String as PropType<ColorFormat>, default: 'hex' },
    disallowInput: Boolean,
    fixOnBlur: { type: Boolean, default: true },
    withPreview: { type: Boolean, default: true },
    withEyeDropper: { type: Boolean, default: true },
    popoverProps: Object,
    closeOnColorSwatchClick: Boolean,
    eyeDropperButtonProps: Object,
    eyeDropperIcon: { type: null as unknown as PropType<any>, default: undefined },
    withPicker: { type: Boolean, default: true },
    swatches: Array as PropType<string[]>,
    swatchesPerRow: { type: Number, default: 7 },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const internal = ref(props.defaultValue)
    const current = () => props.modelValue ?? props.value ?? internal.value
    const controlled = () => props.modelValue !== undefined || props.value !== undefined
    const opened = ref(false)
    const lastValid = ref(isColorValid(current()) ? current() : '')
    const setValue = (value: string, end = false) => {
      if (!controlled()) internal.value = value
      props.onChange?.(value)
      emit('update:modelValue', value)
      if (isColorValid(value)) {
        lastValid.value = value
        if (end) props.onChangeEnd?.(convertHsvaTo(props.format, parseColor(value)))
      }
    }
    watch(
      () => props.format,
      () => {
        if (isColorValid(current())) setValue(convertHsvaTo(props.format, parseColor(current())))
      },
    )
    const pickerDisabled = computed(
      () => !!(attrs as any).readOnly || (!props.withPicker && !props.swatches?.length),
    )
    const useEyeDropper = async () => {
      const EyeDropper = typeof window !== 'undefined' ? (window as any).EyeDropper : undefined
      if (!EyeDropper) return
      try {
        const result = await new EyeDropper().open()
        if (result?.sRGBHex) setValue(convertHsvaTo(props.format, parseColor(result.sRGBHex)), true)
      } catch {}
    }
    return () => {
      const disabled = !!(attrs as any).disabled
      const readOnly = !!(attrs as any).readOnly
      const value = current()
      const forwarded: any = { ...attrs }
      delete forwarded.leftSection
      delete forwarded.rightSection
      const preview = props.withPreview
        ? h(ColorSwatch, {
            color: isColorValid(value) ? value : '#fff',
            size: 'var(--ci-preview-size, 18px)',
            class: classes.colorPreview,
            'aria-hidden': true,
          })
        : undefined
      const eyeSupported = typeof window !== 'undefined' && 'EyeDropper' in window
      const eye =
        props.withEyeDropper && eyeSupported && !disabled && !readOnly
          ? h(
              ActionIcon,
              {
                ...props.eyeDropperButtonProps,
                type: 'button',
                __staticSelector: 'ColorInput',
                variant: 'subtle',
                color: 'gray',
                class: classes.eyeDropperButton,
                'aria-label': 'Pick color from screen',
                onClick: useEyeDropper,
              },
              () =>
                props.eyeDropperIcon ??
                h(EyeDropperIcon, {
                  class: classes.eyeDropperIcon,
                }),
            )
          : undefined
      return h(
        Popover,
        {
          position: 'bottom-start',
          offset: 5,
          opened: opened.value,
          onChange: (value: boolean) => (opened.value = value),
          withRoles: false,
          disabled: pickerDisabled.value,
          ...props.popoverProps,
          __staticSelector: 'ColorInput',
        },
        () => [
          h(Popover.Target, null, () =>
            h(InputBase, {
              ...forwarded,
              component: 'input',
              __staticSelector: 'ColorInput',
              autocomplete: 'off',
              spellcheck: false,
              disabled,
              readonly: props.disallowInput || readOnly,
              pointer: props.disallowInput,
              value,
              leftSection: (attrs as any).leftSection ?? preview,
              rightSection: (attrs as any).rightSection ?? eye,
              onInput: (event: Event) => setValue((event.target as HTMLInputElement).value, true),
              onFocus: (event: FocusEvent) => {
                opened.value = true
                ;(attrs as any).onFocus?.(event)
              },
              onClick: (event: MouseEvent) => {
                opened.value = true
                ;(attrs as any).onClick?.(event)
              },
              onBlur: (event: FocusEvent) => {
                if (props.fixOnBlur && value !== lastValid.value) setValue(lastValid.value)
                opened.value = false
                ;(attrs as any).onBlur?.(event)
              },
            }),
          ),
          h(
            Popover.Dropdown,
            { class: classes.dropdown, onMousedown: (event: MouseEvent) => event.preventDefault() },
            () =>
              h(ColorPicker, {
                value,
                format: props.format,
                swatches: props.swatches,
                swatchesPerRow: props.swatchesPerRow,
                withPicker: props.withPicker,
                focusable: false,
                size: (attrs as any).size,
                onChange: (color: string) => setValue(color),
                onChangeEnd: (color: string) => {
                  setValue(color)
                  props.onChangeEnd?.(color)
                },
                onColorSwatchClick: () => {
                  if (props.closeOnColorSwatchClick) opened.value = false
                },
              }),
          ),
        ],
      )
    }
  },
})
Object.assign(ColorInput, { classes: { ...InputBase.classes, ...classes } })
