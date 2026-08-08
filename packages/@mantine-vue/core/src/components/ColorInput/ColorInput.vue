<script setup lang="ts">
import { computed, h, ref, useAttrs, useSlots, watch } from 'vue'
import { resolveNode } from '../../core'
import { ActionIcon } from '../ActionIcon'
import { ColorPicker, convertHsvaTo, isColorValid, parseColor } from '../ColorPicker'
import { ColorSwatch } from '../ColorSwatch'
import { InputBase } from '../InputBase'
import { Popover, PopoverDropdown, PopoverTarget } from '../Popover'
import { EyeDropperIcon } from './EyeDropperIcon'
import type { ColorInputProps, ColorInputSlots } from './ColorInput.types'
import classes from './ColorInput.module.css'

defineOptions({
  name: 'ColorInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ColorInputProps>(), {
  modelValue: undefined,
  defaultValue: '',
  format: 'hex',
  disallowInput: false,
  fixOnBlur: true,
  withPreview: true,
  withEyeDropper: true,
  closeOnColorSwatchClick: false,
  eyeDropperIcon: undefined,
  withPicker: true,
  swatchesPerRow: 7,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'change-end': [value: string]
}>()

defineSlots<ColorInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const internal = ref(props.defaultValue)

const current = () => props.modelValue ?? internal.value
const controlled = () => props.modelValue !== undefined

const opened = ref(false)

/** The last value that parsed, used to restore the input on blur. */
const lastValid = ref(isColorValid(current()) ? current() : '')

function setValue(value: string, end = false) {
  if (!controlled()) {
    internal.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)

  // A half-typed color is still emitted so the input stays responsive, but only a valid
  // one becomes the fallback and reaches `onChangeEnd`.
  if (isColorValid(value)) {
    lastValid.value = value

    if (end) {
      emit('change-end', convertHsvaTo(props.format, parseColor(value)))
    }
  }
}

// Changing the format rewrites the current value into the new notation.
watch(
  () => props.format,
  () => {
    if (isColorValid(current())) {
      setValue(convertHsvaTo(props.format, parseColor(current())))
    }
  },
)

/** Nothing to pick from: no picker and no swatches, or the input is read only. */
const pickerDisabled = computed(
  () => !!(attrs as any).readOnly || (!props.withPicker && !props.swatches?.length),
)

async function useEyeDropper() {
  const EyeDropper = typeof window !== 'undefined' ? (window as any).EyeDropper : undefined

  if (!EyeDropper) {
    return
  }

  try {
    const result = await new EyeDropper().open()

    if (result?.sRGBHex) {
      setValue(convertHsvaTo(props.format, parseColor(result.sRGBHex)), true)
    }
  } catch {
    // The user dismissed the picker; there is nothing to report.
  }
}

const disabled = computed(() => !!(attrs as any).disabled)
const readOnly = computed(() => !!(attrs as any).readOnly)
const value = computed(() => current())

/** Both sections are computed here, so they must not also arrive as attributes. */
const forwarded = computed(() => {
  const result: any = { ...attrs }
  delete result.leftSection
  delete result.rightSection
  return result
})

const preview = computed(() =>
  props.withPreview
    ? h(ColorSwatch, {
        // An unparseable value would render as a transparent swatch, so fall back.
        color: isColorValid(value.value) ? value.value : '#fff',
        size: 'var(--ci-preview-size, 18px)',
        class: classes.colorPreview,
        'aria-hidden': true,
      })
    : undefined,
)

/** The EyeDropper API is Chromium only, so the button is feature detected. */
const eyeSupported = computed(() => typeof window !== 'undefined' && 'EyeDropper' in window)

const eye = computed(() =>
  props.withEyeDropper && eyeSupported.value && !disabled.value && !readOnly.value
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
          resolveNode(props.eyeDropperIcon, slots.eyeDropperIcon) ??
          h(EyeDropperIcon, { class: classes.eyeDropperIcon }),
      )
    : undefined,
)

/** A consumer section, even an explicitly empty one, wins over the generated one. */
const leftSection = computed(() =>
  (attrs as any).leftSection !== undefined || slots.leftSection
    ? (attrs as any).leftSection
    : preview.value,
)

const rightSection = computed(() =>
  (attrs as any).rightSection !== undefined || slots.rightSection
    ? (attrs as any).rightSection
    : eye.value,
)

function onPopoverChange(next: boolean) {
  opened.value = next
}

function onInput(event: Event) {
  setValue((event.target as HTMLInputElement).value, true)
}

function onFocus(event: FocusEvent) {
  opened.value = true
  ;(attrs as any).onFocus?.(event)
}

function onClick(event: MouseEvent) {
  opened.value = true
  ;(attrs as any).onClick?.(event)
}

function onBlur(event: FocusEvent) {
  if (props.fixOnBlur && value.value !== lastValid.value) {
    setValue(lastValid.value)
  }

  opened.value = false
  ;(attrs as any).onBlur?.(event)
}

/** Clicking inside the dropdown must not blur the input, which would close it. */
function onDropdownMousedown(event: MouseEvent) {
  event.preventDefault()
}

function onPickerChange(color: string) {
  setValue(color)
}

function onPickerChangeEnd(color: string) {
  setValue(color)
  emit('change-end', color)
}

function onColorSwatchClick() {
  if (props.closeOnColorSwatchClick) {
    opened.value = false
  }
}
</script>

<template>
  <Popover
    v-bind="props.popoverProps"
    position="bottom-start"
    :offset="5"
    :opened="opened"
    :with-roles="false"
    :disabled="pickerDisabled"
    __static-selector="ColorInput"
    @update:opened="onPopoverChange"
  >
    <PopoverTarget>
      <!--
        `InputBase` has to be the direct child: `Popover.Target` clones the child vnode
        to inject the reference ref and the popover handlers.
      -->
      <InputBase
        v-bind="forwarded"
        component="input"
        __static-selector="ColorInput"
        autocomplete="off"
        :spellcheck="false"
        :disabled="disabled"
        :readonly="props.disallowInput || readOnly"
        :pointer="props.disallowInput"
        :model-value="value"
        :left-section="leftSection"
        :right-section="rightSection"
        @input="onInput"
        @focus="onFocus"
        @click="onClick"
        @blur="onBlur"
      >
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
      </InputBase>
    </PopoverTarget>

    <PopoverDropdown :class="classes.dropdown" @mousedown="onDropdownMousedown">
      <ColorPicker
        :model-value="value"
        :format="props.format"
        :swatches="props.swatches"
        :swatches-per-row="props.swatchesPerRow"
        :with-picker="props.withPicker"
        :focusable="false"
        :size="(attrs as any).size"
        @change="onPickerChange"
        @change-end="onPickerChangeEnd"
        @color-swatch-click="onColorSwatchClick"
      />
    </PopoverDropdown>
  </Popover>
</template>
