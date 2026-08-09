<script lang="ts">
import { createVarsResolver, getSize, getSpacing } from '../../core'

const defaultProps = {
  swatchesPerRow: 7,
  withPicker: true,
  focusable: true,
  size: 'md',
  format: 'hex',
  __staticSelector: 'ColorPicker',
} as const

/** Formats that carry an alpha channel, so the alpha slider and preview are shown. */
const ALPHA_FORMATS = ['hexa', 'rgba', 'hsla']

/** Module scope: created once, not per component instance. */
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

export { defaultProps, varsResolver, ALPHA_FORMATS }
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import { ColorSwatch } from '../ColorSwatch'
import { AlphaSlider } from './AlphaSlider/AlphaSlider'
import { provideColorPickerContext } from './ColorPicker.context'
import type { HsvaColor } from './ColorPicker.types'
import { convertHsvaTo, isColorValid, parseColor } from './converters'
import { HueSlider } from './HueSlider/HueSlider'
import { Saturation } from './Saturation/Saturation'
import { Swatches } from './Swatches/Swatches'
import type { ColorPickerOwnProps } from './ColorPicker.props.types'
import classes from './ColorPicker.module.css'

defineOptions({
  name: 'ColorPicker',
  inheritAttrs: false,
})

/**
 * `withPicker` and `focusable` must stay `undefined`: Vue casts an absent boolean prop
 * to `false`, and `filterProps` keeps `false`, so `defaultProps` could never supply
 * their `true` defaults and the picker would render empty.
 */
const rawProps = withDefaults(defineProps<ColorPickerOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  withPicker: undefined,
  focusable: undefined,
  fullWidth: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'change-end': [value: string]
  'color-swatch-click': [color: string]
}>()

const attrs = useAttrs()
const props = useProps('ColorPicker', defaultProps as any, rawProps) as any

const [current, setCurrent, controlled] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '#FFFFFF',
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const parsed = ref<HsvaColor>(parseColor(current.value))

/**
 * While the user is dragging, the picker owns the HSVA state: re-parsing the
 * round-tripped string would quantise it and make the thumb jitter. The flag is
 * cleared shortly after the interaction so external updates apply again.
 */
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

function output(color: HsvaColor) {
  return convertHsvaTo(props.format, color)
}

function change(partial: Partial<HsvaColor>) {
  parsed.value = { ...parsed.value, ...partial }
  setCurrent(output(parsed.value))
}

watch(
  () => props.modelValue,
  (value) => {
    if (typeof value === 'string' && isColorValid(value) && !scrubbing) {
      parsed.value = parseColor(value)
    }
  },
)

watch(
  () => props.format,
  () => setCurrent(output(parsed.value)),
)

function onScrubStart() {
  clearTimeout(timer)
  scrubbing = true
}

function onScrubEnd() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    scrubbing = false
  }, 200)
}

onBeforeUnmount(() => clearTimeout(timer))

const withAlpha = computed(() => ALPHA_FORMATS.includes(props.format))

function onSaturationChangeEnd(value: Partial<HsvaColor>) {
  emit('change-end', output({ ...parsed.value, ...value }))
}

function onHueChangeEnd(hue: number) {
  emit('change-end', output({ ...parsed.value, h: hue }))
}

function onAlphaChangeEnd(alpha: number) {
  emit('change-end', output({ ...parsed.value, a: alpha }))
}

function setSwatchValue(color: string) {
  const converted = output(parseColor(color))
  setCurrent(converted)

  // In controlled mode the incoming `value` watcher re-parses; uncontrolled has to
  // update the HSVA state itself.
  if (!controlled.value) {
    parsed.value = parseColor(color)
  }
}

function onSwatchChangeEnd(color: string) {
  const converted = output(parseColor(color))
  emit('color-swatch-click', converted)
  emit('change-end', converted)
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('wrapper', { className: attrs.class, style: attrs.style }) }"
    :mod="[{ fullWidth: props.fullWidth }, props.mod]"
  >
    <input
      v-if="props.name"
      type="hidden"
      :name="props.name"
      :value="current"
      v-bind="props.hiddenInputProps"
    />

    <template v-if="props.withPicker">
      <Saturation
        :value="parsed"
        :color="current"
        :size="props.size"
        :focusable="props.focusable"
        :saturation-label="props.saturationLabel"
        @change="change"
        @change-end="onSaturationChangeEnd"
        @scrub-start="onScrubStart"
        @scrub-end="onScrubEnd"
      />

      <div v-bind="getStyles('body')">
        <div v-bind="getStyles('sliders')">
          <HueSlider
            :model-value="parsed.h"
            :size="props.size"
            :focusable="props.focusable"
            :aria-label="props.hueLabel"
            @change="(hue: number) => change({ h: hue })"
            @change-end="onHueChangeEnd"
            @scrub-start="onScrubStart"
            @scrub-end="onScrubEnd"
          />

          <AlphaSlider
            v-if="withAlpha"
            :model-value="parsed.a"
            :color="convertHsvaTo('hex', parsed)"
            :size="props.size"
            :focusable="props.focusable"
            :aria-label="props.alphaLabel"
            @change="(alpha: number) => change({ a: alpha })"
            @change-end="onAlphaChangeEnd"
            @scrub-start="onScrubStart"
            @scrub-end="onScrubEnd"
          />
        </div>

        <ColorSwatch
          v-if="withAlpha"
          :color="current"
          radius="sm"
          size="var(--cp-preview-size)"
          v-bind="getStyles('preview')"
        />
      </div>
    </template>

    <Swatches
      v-if="Array.isArray(props.swatches)"
      :data="props.swatches"
      :focusable="props.focusable"
      :value="current"
      :set-value="setSwatchValue"
      @change-end="onSwatchChangeEnd"
    />
  </Box>
</template>
