<script lang="ts">
import { createVarsResolver, getSize } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  controls: {
    '--ni-chevron-size': getSize(size, 'ni-chevron-size'),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, ref, useAttrs, useSlots } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { Box, useStyles } from '../../core'
import { InputBase } from '../InputBase'
import { UnstyledButton } from '../UnstyledButton'
import { formatNumber, type NumberFormatterOptions } from '../NumberFormatter'
import { NumberInputChevron } from './NumberInputChevron'
import {
  clamp,
  clampAndSanitizeInput,
  clampBigInt,
  clampCaretPosition,
  getCaretBoundaries,
  getDecimalPlaces,
  isStrictAllowed,
  parseBigIntInputValue,
  parseNumberInputValue,
  restoreInputValue,
  sanitizeNumberInputString,
  stripFormatting,
  toNumeric,
} from './number-input-utils'
import type {
  NumberInputProps,
  NumberInputSlots,
  NumberInputValue,
  NumberInputValueChangePayload,
} from './NumberInput.types'
import classes from './NumberInput.module.css'

defineOptions({
  name: 'NumberInput',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  allowLeadingZeros: true,
  allowNegative: true,
  allowedDecimalSeparators: () => ['.', ','],
  decimalSeparator: '.',
  fixedDecimalScale: false,
  thousandsGroupStyle: 'thousand',
  thousandSeparator: undefined,
  min: undefined,
  max: undefined,
  step: 1,
  hideControls: false,
  clampBehavior: 'blur',
  allowDecimal: true,
  startValue: 0,
  withKeyboardEvents: true,
  trimLeadingZeroesOnBlur: true,
  selectAllOnFocus: false,
  size: 'sm',
  disabled: false,
  readOnly: false,
  rightSection: undefined,
  label: undefined,
  description: undefined,
  error: undefined,
  required: false,
  withAsterisk: undefined,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: NumberInputValue]
  change: [value: NumberInputValue]
  'value-change': [payload: NumberInputValueChangePayload, event: { source: string }]
  'min-reached': []
  'max-reached': []
}>()

defineSlots<NumberInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const inputRef = ref<HTMLInputElement | null>(null)
const isEditing = ref(false)
const isBigIntMode = computed(
  () => typeof props.modelValue === 'bigint' || typeof props.defaultValue === 'bigint',
)
const [value, setValue] = useUncontrolled<NumberInputValue>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})
const getStyles = useStyles({
  name: 'NumberInput',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const formatterOptions = computed<NumberFormatterOptions>(() => ({
  allowNegative: props.allowNegative,
  decimalScale: props.decimalScale,
  decimalSeparator: props.decimalSeparator,
  fixedDecimalScale: props.fixedDecimalScale,
  prefix: props.prefix,
  suffix: props.suffix,
  thousandsGroupStyle: props.thousandsGroupStyle,
  thousandSeparator: props.thousandSeparator,
}))

const getFormatterOptions = (nextValue: NumberInputValue = value.value) => ({
  ...formatterOptions.value,
  fixedDecimalScale:
    isEditing.value || typeof nextValue === 'string'
      ? false
      : formatterOptions.value.fixedDecimalScale,
})

const displayValue = computed(() =>
  value.value === '' || value.value === '-'
    ? String(value.value)
    : formatNumber(value.value, getFormatterOptions()),
)

const clampCaretToFormatting = (input: HTMLInputElement) => {
  const { min, max } = getCaretBoundaries(input.value, formatterOptions.value)
  const start = input.selectionStart
  const end = input.selectionEnd

  if (start === null || end === null) {
    return
  }

  const nextStart = clampCaretPosition(start, min, max)
  const nextEnd = clampCaretPosition(end, min, max)

  if (nextStart !== start || nextEnd !== end) {
    input.setSelectionRange(nextStart, nextEnd)
  }
}

const scheduleCaretClamp = (input: HTMLInputElement) => {
  setTimeout(() => clampCaretToFormatting(input), 0)
}

const commitValue = (nextValue: NumberInputValue, source = 'event') => {
  if (props.clampBehavior === 'strict') {
    const numeric = toNumeric(nextValue)

    if (
      typeof numeric === 'number' &&
      (typeof props.min === 'number' || typeof props.max === 'number')
    ) {
      if (
        (typeof props.min === 'number' && numeric < props.min) ||
        (typeof props.max === 'number' && numeric > props.max)
      ) {
        return
      }
    }
  }

  setValue(nextValue)
  const raw = typeof nextValue === 'bigint' ? nextValue.toString() : String(nextValue)
  emit(
    'value-change',
    {
      floatValue:
        typeof nextValue === 'number'
          ? nextValue
          : Number.isNaN(Number(raw))
            ? undefined
            : Number(raw),
      formattedValue:
        nextValue === '' ? '' : formatNumber(nextValue, getFormatterOptions(nextValue)),
      value: raw,
    },
    { source },
  )
}

const stepValue = (direction: 1 | -1) => {
  if (props.disabled || props.readOnly) {
    return
  }

  if (isBigIntMode.value) {
    const current = typeof value.value === 'bigint' ? value.value : BigInt(0)
    const step = typeof props.step === 'bigint' ? props.step : BigInt(props.step)
    const start = typeof props.startValue === 'bigint' ? props.startValue : BigInt(props.startValue)
    const base = value.value === '' || value.value === '-' ? start : current
    const next = base + step * BigInt(direction)
    const min =
      typeof props.min === 'bigint'
        ? props.min
        : props.min === undefined
          ? undefined
          : BigInt(props.min)
    const max =
      typeof props.max === 'bigint'
        ? props.max
        : props.max === undefined
          ? undefined
          : BigInt(props.max)
    const clamped = clampBigInt(next, min, max)

    if (max !== undefined && next > max) {
      emit('max-reached')
    }

    if (min !== undefined && next < min) {
      emit('min-reached')
    }

    commitValue(clamped, direction === 1 ? 'increment' : 'decrement')
    return
  }

  const numeric = toNumeric(value.value)
  const step = typeof props.step === 'number' ? props.step : Number(props.step)
  const start = typeof props.startValue === 'number' ? props.startValue : Number(props.startValue)
  const base = typeof numeric === 'number' ? numeric : start
  const precision = Math.max(getDecimalPlaces(base), getDecimalPlaces(step))
  const factor = 10 ** precision
  const next = (Math.round(base * factor) + Math.round(step * factor) * direction) / factor
  const min = typeof props.min === 'number' ? props.min : !props.allowNegative ? 0 : undefined
  const max = typeof props.max === 'number' ? props.max : undefined
  const clamped = clamp(next, min, max)

  if (max !== undefined && next > max) {
    emit('max-reached')
  }

  if (min !== undefined && next < min) {
    emit('min-reached')
  }

  commitValue(clamped, direction === 1 ? 'increment' : 'decrement')
}

assignRef(props.handlersRef, {
  increment: () => stepValue(1),
  decrement: () => stepValue(-1),
})

// Step-hold state
let holdTimeout: ReturnType<typeof setTimeout> | null = null
let holdScheduled: ReturnType<typeof setTimeout> | null = null
let holdStartTime = 0

const clearHold = () => {
  if (holdTimeout !== null) {
    clearTimeout(holdTimeout)
    holdTimeout = null
  }
  if (holdScheduled !== null) {
    clearTimeout(holdScheduled)
    holdScheduled = null
  }
}

const startHold = (direction: 1 | -1) => {
  if (props.stepHoldDelay === undefined) return
  holdStartTime = Date.now()
  holdTimeout = setTimeout(() => {
    holdTimeout = null
    const scheduleNext = () => {
      stepValue(direction)
      const elapsed = Date.now() - holdStartTime
      const interval =
        typeof props.stepHoldInterval === 'function'
          ? props.stepHoldInterval(elapsed)
          : (props.stepHoldInterval ?? 0)
      holdScheduled = setTimeout(scheduleNext, interval)
    }
    scheduleNext()
  }, props.stepHoldDelay)
}

onBeforeUnmount(clearHold)

const controls = () =>
  h(Box, { ...getStyles('controls'), component: 'div' }, () => [
    h(
      UnstyledButton,
      {
        ...getStyles('control'),
        tabIndex: -1,
        'aria-hidden': true,
        disabled:
          props.disabled ||
          (typeof toNumeric(value.value) === 'number' &&
            typeof props.max === 'number' &&
            (toNumeric(value.value) as number) >= props.max),
        mod: { direction: 'up' },
        onMousedown: (event: MouseEvent) => event.preventDefault(),
        onPointerdown: (event: PointerEvent) => {
          event.preventDefault()
          inputRef.value?.focus()
          stepValue(1)
          startHold(1)
        },
        onPointerup: clearHold,
        onPointerleave: clearHold,
        onPointercancel: clearHold,
      },
      () => h(NumberInputChevron, { direction: 'up' }),
    ),
    h(
      UnstyledButton,
      {
        ...getStyles('control'),
        tabIndex: -1,
        'aria-hidden': true,
        disabled:
          props.disabled ||
          (typeof toNumeric(value.value) === 'number' &&
            typeof props.min === 'number' &&
            (toNumeric(value.value) as number) <= props.min),
        mod: { direction: 'down' },
        onMousedown: (event: MouseEvent) => event.preventDefault(),
        onPointerdown: (event: PointerEvent) => {
          event.preventDefault()
          inputRef.value?.focus()
          stepValue(-1)
          startHold(-1)
        },
        onPointerup: clearHold,
        onPointerleave: clearHold,
        onPointercancel: clearHold,
      },
      () => h(NumberInputChevron, { direction: 'down' }),
    ),
  ])

/** The step controls double as the right section unless one was supplied. */
const rightSection = computed(() =>
  props.hideControls || props.readOnly
    ? props.rightSection
    : props.rightSection !== undefined || slots.rightSection
      ? props.rightSection
      : controls,
)

const rightSectionPointerEvents = computed(
  () => props.rightSectionPointerEvents ?? (props.disabled ? 'none' : undefined),
)

const rightSectionWidth = computed(
  () => props.rightSectionWidth ?? `var(--ni-right-section-width-${props.size || 'sm'})`,
)

/** `bigint` values are integers only, so the numeric keypad is the right hint. */
const inputMode = computed(() => (isBigIntMode.value ? 'numeric' : 'decimal'))

/** `InputBase` renders a wrapper, so the element to drive is the inner input. */
function setRootRef(node: any) {
  inputRef.value = node?.querySelector?.('input') ?? node
}

function onInput(event: Event) {
  isEditing.value = true
  const input = event.currentTarget as HTMLInputElement
  const rawValue = stripFormatting(input.value, formatterOptions.value)
  const decimalSeparator = props.decimalSeparator || '.'

  // Every accepted separator is normalised to a plain `.` before parsing.
  const separatorsToReplace = props.allowedDecimalSeparators.filter(
    (separator) => separator !== decimalSeparator,
  )
  const raw = separatorsToReplace.reduce(
    (acc, separator) => acc.split(separator).join('.'),
    rawValue.replace(decimalSeparator, '.'),
  )

  const sanitized = sanitizeNumberInputString(
    raw,
    props.allowDecimal,
    props.allowNegative,
    props.decimalScale,
  )

  const nextValue = isBigIntMode.value
    ? parseBigIntInputValue(sanitized, props.allowNegative, props.allowLeadingZeros)
    : parseNumberInputValue(
        sanitized,
        props.allowDecimal,
        props.allowNegative,
        props.allowLeadingZeros,
        props.decimalScale,
        props.fixedDecimalScale,
      )

  // `strict` rejects the keystroke outright and puts the previous value back, caret
  // included, so an out-of-range number never appears in the field.
  if (
    props.clampBehavior === 'strict' &&
    !isBigIntMode.value &&
    !isStrictAllowed(
      nextValue,
      typeof props.min === 'number' ? props.min : undefined,
      typeof props.max === 'number' ? props.max : undefined,
    )
  ) {
    restoreInputValue(input, displayValue.value)
    return
  }

  // `''` and `'-'` are intermediate states that must survive unformatted.
  const formattedNextValue =
    nextValue === '' || nextValue === '-'
      ? String(nextValue)
      : formatNumber(nextValue, getFormatterOptions(nextValue))

  if (input.value !== formattedNextValue) {
    restoreInputValue(input, formattedNextValue)
  }

  scheduleCaretClamp(input)
  commitValue(nextValue)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.readOnly && props.withKeyboardEvents && event.key === 'ArrowUp') {
    event.preventDefault()
    stepValue(1)
  }

  if (!props.readOnly && props.withKeyboardEvents && event.key === 'ArrowDown') {
    event.preventDefault()
    stepValue(-1)
  }

  scheduleCaretClamp(event.currentTarget as HTMLInputElement)
}

function onKeyup(event: KeyboardEvent) {
  scheduleCaretClamp(event.currentTarget as HTMLInputElement)
}

function onClick(event: MouseEvent) {
  scheduleCaretClamp(event.currentTarget as HTMLInputElement)
}

function onFocus(event: FocusEvent) {
  isEditing.value = true

  if (props.selectAllOnFocus) {
    // Deferred: the browser sets its own selection after the focus event.
    setTimeout(() => (event.currentTarget as HTMLInputElement).select(), 0)
  } else {
    scheduleCaretClamp(event.currentTarget as HTMLInputElement)
  }
}

function onBlur() {
  isEditing.value = false
  let sanitizedValue = value.value
  const min = typeof props.min === 'number' ? props.min : undefined
  const max = typeof props.max === 'number' ? props.max : undefined

  if (props.clampBehavior === 'blur' && typeof sanitizedValue === 'number') {
    sanitizedValue = clamp(sanitizedValue, min, max)
  }

  // Above 15 decimal places the value cannot round-trip through a `number`, so it is
  // left exactly as typed rather than risking a silent loss of precision.
  if (
    props.trimLeadingZeroesOnBlur &&
    typeof sanitizedValue === 'string' &&
    getDecimalPlaces(sanitizedValue) < 15
  ) {
    sanitizedValue = clampAndSanitizeInput(sanitizedValue, max, min)
  }

  if (sanitizedValue !== value.value) {
    commitValue(sanitizedValue, 'blur')
  }
}
</script>

<template>
  <InputBase
    v-bind="attrs"
    component="input"
    __static-selector="NumberInput"
    :__styles-api-props="props"
    :input-mode="inputMode"
    type="text"
    :model-value="displayValue"
    :read-only="props.readOnly"
    :disabled="props.disabled"
    :size="props.size"
    :label="props.label"
    :description="props.description"
    :error="props.error"
    :required="props.required"
    :with-asterisk="props.withAsterisk"
    :wrapper-props="props.wrapperProps"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    :unstyled="props.unstyled"
    :right-section="rightSection"
    :right-section-pointer-events="rightSectionPointerEvents"
    :right-section-width="rightSectionWidth"
    :class="[classes.root, attrs.class]"
    :root-ref="setRootRef"
    @input="onInput"
    @keydown="onKeydown"
    @keyup="onKeyup"
    @click="onClick"
    @focus="onFocus"
    @blur="onBlur"
  >
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
  </InputBase>
</template>
