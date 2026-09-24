<script lang="ts">
import { createVarsResolver, getSize } from '../../core'

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
  clampBigInt,
  clampCaretPosition,
  canStep,
  canStepBigInt,
  getCaretBoundaries,
  getDecimalPlaces,
  getCaretPositionAfterPaste,
  isStrictAllowed,
  parseBigIntInputValue,
  parseNumberInputValue,
  normalizePastedValue,
  restoreInputValue,
  sanitizeNumberInputString,
  sanitizeInputOnBlur,
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

const displayValue = computed(() =>
  value.value === '' || value.value === '-'
    ? String(value.value)
    : formatNumber(value.value, formatterOptions.value),
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

const getFormattedCaretPosition = (value: string, formattedValue: string, position: number) => {
  let formattedPosition = 0

  for (const character of value.slice(0, position)) {
    const nextPosition = formattedValue.indexOf(character, formattedPosition)

    if (nextPosition !== -1) {
      formattedPosition = nextPosition + 1
    }
  }

  return formattedPosition
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
      formattedValue: nextValue === '' ? '' : formatNumber(nextValue, formatterOptions.value),
      value: raw,
    },
    { source },
  )
}

const canStepValue = computed(() =>
  isBigIntMode.value
    ? canStepBigInt(value.value as bigint | string, props.allowNegative)
    : canStep(value.value as number | string),
)

const stepValue = (direction: 1 | -1) => {
  if (props.disabled || props.readOnly || !canStepValue.value) {
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
          ? props.allowNegative
            ? undefined
            : BigInt(0)
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
  props.hideControls || props.readOnly || !canStepValue.value
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

/**
 * `Input` hands back the field itself, so no wrapper lookup is needed. The same node drives the
 * internal `inputRef`, the caller's `rootRef` and the exposed `rootElement`.
 */
const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  inputRef.value = node as HTMLInputElement | null
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })

function onInput(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  const inputValue = input.value
  const selectionStart = input.selectionStart
  const selectionEnd = input.selectionEnd
  const rawValue = stripFormatting(inputValue, formatterOptions.value)
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
    isBigIntMode.value ? false : props.allowDecimal,
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
      : formatNumber(nextValue, formatterOptions.value)

  if (input.value !== formattedNextValue) {
    restoreInputValue(input, formattedNextValue)

    if (props.fixedDecimalScale && selectionStart !== null && selectionEnd !== null) {
      input.setSelectionRange(
        getFormattedCaretPosition(inputValue, formattedNextValue, selectionStart),
        getFormattedCaretPosition(inputValue, formattedNextValue, selectionEnd),
      )
    }
  }

  scheduleCaretClamp(input)
  if (!Object.is(nextValue, value.value)) {
    commitValue(nextValue)
  }
}

function onKeydown(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement

  if (
    event.key === 'Backspace' &&
    !props.readOnly &&
    !props.disabled &&
    input.selectionStart !== null &&
    input.selectionStart === input.selectionEnd
  ) {
    if (input.selectionStart === 0) {
      event.preventDefault()
    } else if (props.fixedDecimalScale && typeof props.decimalScale === 'number') {
      const decimalPosition = input.value.indexOf(props.decimalSeparator)
      const isAfterDecimalSeparator =
        input.value[input.selectionStart - 1] === props.decimalSeparator
      const deletePosition = input.selectionStart - (isAfterDecimalSeparator ? 2 : 1)

      if (deletePosition >= 0 && deletePosition < decimalPosition) {
        const nextInputValue =
          input.value.slice(0, deletePosition) + input.value.slice(deletePosition + 1)
        const unformattedValue = stripFormatting(nextInputValue, formatterOptions.value)
        const unsignedValue = unformattedValue.startsWith('-')
          ? unformattedValue.slice(1)
          : unformattedValue
        const [integerPart, decimalPart = ''] = unsignedValue.split('.')

        if (!/\d/.test(integerPart) && /^0*$/.test(decimalPart)) {
          event.preventDefault()
          input.value = ''
          input.setSelectionRange(0, 0)
          input.dispatchEvent(new Event('input', { bubbles: true }))
        } else if (isAfterDecimalSeparator) {
          event.preventDefault()
          input.value = nextInputValue
          input.setSelectionRange(deletePosition, deletePosition)
          input.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    }
  }

  if (!props.readOnly && props.withKeyboardEvents && event.key === 'ArrowUp') {
    event.preventDefault()
    stepValue(1)
  }

  if (!props.readOnly && props.withKeyboardEvents && event.key === 'ArrowDown') {
    event.preventDefault()
    stepValue(-1)
  }

  scheduleCaretClamp(input)
}

function onKeyup(event: KeyboardEvent) {
  scheduleCaretClamp(event.currentTarget as HTMLInputElement)
}

function onClick(event: MouseEvent) {
  scheduleCaretClamp(event.currentTarget as HTMLInputElement)
}

function onFocus(event: FocusEvent) {
  if (props.selectAllOnFocus) {
    // Deferred: the browser sets its own selection after the focus event.
    window.setTimeout(() => inputRef.value?.select(), 0)
  } else {
    scheduleCaretClamp(event.currentTarget as HTMLInputElement)
  }
}

function onPaste(event: ClipboardEvent) {
  const pastedText = event.clipboardData?.getData('text') ?? ''
  const decimalSeparator = props.decimalSeparator || '.'
  const thousandSeparator =
    props.thousandSeparator === true
      ? ','
      : props.thousandSeparator === false
        ? undefined
        : props.thousandSeparator
  const modifiedText = normalizePastedValue(pastedText, {
    decimalSeparator,
    thousandSeparator,
    allowedDecimalSeparators: props.allowedDecimalSeparators,
    thousandsGroupStyle: props.thousandsGroupStyle,
  })

  if (modifiedText !== pastedText && inputRef.value) {
    event.preventDefault()
    const input = inputRef.value
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    const newValue = input.value.slice(0, start) + modifiedText + input.value.slice(end)
    input.value = newValue
    input.dispatchEvent(new Event('input', { bubbles: true }))

    const rawCaret = start + modifiedText.length
    setTimeout(() => {
      const caret = getCaretPositionAfterPaste(newValue, rawCaret, input.value, decimalSeparator)
      input.setSelectionRange(caret, caret)
    }, 0)
  }
}

function onBlur() {
  let sanitizedValue = value.value
  const min = typeof props.min === 'number' ? props.min : undefined
  const max = typeof props.max === 'number' ? props.max : undefined

  if (props.clampBehavior === 'blur' && typeof sanitizedValue === 'number') {
    sanitizedValue = clamp(sanitizedValue, min, max)
  }

  // Above 15 decimal places the value cannot round-trip through a `number`, so it is
  // left exactly as typed rather than risking a silent loss of precision.
  if (!isBigIntMode.value && typeof sanitizedValue === 'string') {
    sanitizedValue = sanitizeInputOnBlur(sanitizedValue, {
      min,
      max,
      trim: props.trimLeadingZeroesOnBlur && getDecimalPlaces(sanitizedValue) < 15,
      clamp: props.clampBehavior === 'blur',
    })
  }

  if (sanitizedValue !== value.value) {
    commitValue(sanitizedValue, 'blur')
  }
}
</script>

<template>
  <!-- NumberInput adds style names that InputBase does not expose, so forwarded styles are cast. -->
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
    :class-names="props.classNames as any"
    :styles="props.styles as any"
    :vars="props.vars as any"
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
    @paste="onPaste"
    @blur="onBlur"
  >
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
  </InputBase>
</template>
