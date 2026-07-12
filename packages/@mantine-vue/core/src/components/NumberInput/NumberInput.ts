import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  ref,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { Box, createVarsResolver, getSize, type MantineNode, useStyles } from '../../core'
import { InputBase } from '../InputBase'

export interface NumberInputSlots {
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
}
import { UnstyledButton } from '../UnstyledButton'
import {
  formatNumber,
  type NumberFormatterOptions,
  type ThousandsGroupStyle,
} from '../NumberFormatter'
import { NumberInputChevron } from './NumberInputChevron'
import classes from './NumberInput.module.css'

const leadingDecimalZeroPattern = /^(0\.0*|-0(\.0*)?)$/
const leadingZerosPattern = /^-?0\d+(\.\d+)?\.?$/
const trailingZerosPattern = /\.\d*0$/
const trailingDecimalSeparatorPattern = /^-?\d+\.$/

export interface NumberInputHandlers {
  increment: () => void
  decrement: () => void
}

export type NumberInputValue = number | string | bigint
export type NumberInputStylesNames =
  | 'controls'
  | 'control'
  | 'input'
  | 'wrapper'
  | 'section'
  | 'bottomSection'
  | 'root'

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  controls: {
    '--ni-chevron-size': getSize(size, 'ni-chevron-size'),
  },
}))

function clamp(value: number, min?: number, max?: number) {
  return Math.min(max ?? value, Math.max(min ?? value, value))
}

function clampBigInt(value: bigint, min?: bigint, max?: bigint) {
  if (min !== undefined && value < min) {
    return min
  }

  if (max !== undefined && value > max) {
    return max
  }

  return value
}

function stripFormatting(value: string, options: NumberFormatterOptions) {
  let next = value

  if (options.prefix && next.startsWith(options.prefix)) {
    next = next.slice(options.prefix.length)
  }

  if (options.suffix) {
    next = next.split(options.suffix).join('')
  }

  const separator = options.thousandSeparator === true ? ',' : options.thousandSeparator

  if (separator) {
    next = next.split(String(separator)).join('')
  }

  if (options.decimalSeparator && options.decimalSeparator !== '.') {
    next = next.replace(options.decimalSeparator, '.')
  }

  return next.trim()
}

function parseNumberInputValue(
  rawValue: string,
  allowDecimal: boolean,
  allowNegative: boolean,
  allowLeadingZeros: boolean,
  decimalScale?: number,
  fixedDecimalScale?: boolean,
): NumberInputValue {
  let normalized = rawValue

  if (!allowNegative) {
    normalized = normalized.replace(/-/g, '')
  }

  if (!allowDecimal) {
    normalized = normalized.split('.')[0]
  }

  if (allowDecimal && typeof decimalScale === 'number' && normalized.includes('.')) {
    const [integerPart, decimalPart = ''] = normalized.split('.')
    normalized = `${integerPart}.${decimalPart.slice(0, decimalScale)}`
  }

  if (normalized === '' || (allowNegative && normalized === '-') || normalized.endsWith('.')) {
    return normalized
  }

  if (fixedDecimalScale && typeof decimalScale === 'number' && normalized.includes('.')) {
    const [, decimalPart = ''] = normalized.split('.')

    if (decimalPart.length < decimalScale) {
      return normalized
    }
  }

  if (trailingZerosPattern.test(normalized) || leadingDecimalZeroPattern.test(normalized)) {
    return normalized
  }

  if (allowLeadingZeros && leadingZerosPattern.test(normalized)) {
    return normalized
  }

  const parsed = Number(normalized)

  if (Number.isNaN(parsed) || Math.abs(parsed) > Number.MAX_SAFE_INTEGER) {
    return normalized
  }

  return parsed
}

function sanitizeNumberInputString(
  rawValue: string,
  allowDecimal: boolean,
  allowNegative: boolean,
  decimalScale?: number,
) {
  let normalized = rawValue

  if (!allowNegative) {
    normalized = normalized.replace(/-/g, '')
  }

  if (!allowDecimal) {
    return normalized.split('.')[0]
  }

  if (typeof decimalScale === 'number' && normalized.includes('.')) {
    const [integerPart, decimalPart = ''] = normalized.split('.')
    return `${integerPart}.${decimalPart.slice(0, decimalScale)}`
  }

  return normalized
}

function clampAndSanitizeInput(sanitizedValue: string | number, max?: number, min?: number) {
  const stringValue = sanitizedValue.toString()
  const hasTrailingDecimalSeparator = trailingDecimalSeparatorPattern.test(stringValue)
  const replaced = stringValue.replace(/^0+(?=\d)/, '')
  const parsedValue = parseFloat(replaced)

  if (Number.isNaN(parsedValue)) {
    return replaced
  }

  if (parsedValue > Number.MAX_SAFE_INTEGER) {
    return max !== undefined ? max : replaced
  }

  const clamped = clamp(parsedValue, min, max)

  if (hasTrailingDecimalSeparator) {
    const clampedString = clamped.toString().replace(/^0+(?=\d)/, '')
    return `${clampedString}.`
  }

  return clamped
}

function isInRange(value: number | undefined, min: number | undefined, max: number | undefined) {
  if (value === undefined) {
    return true
  }

  const minValid = min === undefined || value >= min
  const maxValid = max === undefined || value <= max

  return minValid && maxValid
}

function isStrictAllowed(value: NumberInputValue, min?: number, max?: number) {
  if (value === '' || value === '-') {
    return true
  }

  if (typeof value === 'bigint') {
    return true
  }

  const parsed = typeof value === 'number' ? value : Number(value)

  if (Number.isNaN(parsed)) {
    return true
  }

  return isInRange(parsed, min, max)
}

function restoreInputValue(input: HTMLInputElement, value: string) {
  input.value = value
}

function getCaretBoundaries(value: string, options: NumberFormatterOptions) {
  const min = options.prefix && value.startsWith(options.prefix) ? options.prefix.length : 0
  const max =
    options.suffix && value.endsWith(options.suffix)
      ? value.length - options.suffix.length
      : value.length

  return { min, max }
}

function clampCaretPosition(position: number, min: number, max: number) {
  return Math.min(max, Math.max(min, position))
}

function parseBigIntInputValue(
  rawValue: string,
  allowNegative: boolean,
  allowLeadingZeros: boolean,
) {
  const normalized = allowNegative ? rawValue : rawValue.replace(/-/g, '')

  if (normalized === '' || (allowNegative && normalized === '-')) {
    return normalized
  }

  if (!/^-?\d+$/.test(normalized) || (allowLeadingZeros && leadingZerosPattern.test(normalized))) {
    return rawValue
  }

  try {
    return BigInt(normalized)
  } catch {
    return normalized
  }
}

function toNumeric(value: NumberInputValue | undefined) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'bigint') {
    return value
  }

  if (typeof value === 'string' && value !== '' && value !== '-') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return undefined
}

function getDecimalPlaces(value: number | string) {
  const match = String(value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
  return Math.max(0, (match?.[1]?.length || 0) - (match?.[2] ? Number(match[2]) : 0))
}

export const NumberInput = defineComponent({
  name: 'NumberInput',
  inheritAttrs: false,
  slots: Object as SlotsType<NumberInputSlots>,
  props: {
    value: {
      type: [String, Number, BigInt] as PropType<NumberInputValue | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number, BigInt] as PropType<NumberInputValue | undefined>,
      default: undefined,
    },
    onChange: { type: Function as PropType<(value: NumberInputValue) => void>, default: undefined },
    onValueChange: {
      type: Function as PropType<
        (
          payload: { floatValue?: number; formattedValue: string; value: string },
          event: { source: string },
        ) => void
      >,
      default: undefined,
    },
    allowLeadingZeros: { type: Boolean, default: true },
    allowNegative: { type: Boolean, default: true },
    allowedDecimalSeparators: {
      type: Array as PropType<string[]>,
      default: () => ['.', ','],
    },
    decimalScale: { type: Number, default: undefined },
    decimalSeparator: { type: String, default: '.' },
    fixedDecimalScale: { type: Boolean, default: false },
    prefix: { type: String, default: undefined },
    suffix: { type: String, default: undefined },
    thousandsGroupStyle: { type: String as PropType<ThousandsGroupStyle>, default: 'thousand' },
    thousandSeparator: {
      type: [String, Boolean] as PropType<string | boolean>,
      default: undefined,
    },
    min: { type: [Number, BigInt] as PropType<number | bigint | undefined>, default: undefined },
    max: { type: [Number, BigInt] as PropType<number | bigint | undefined>, default: undefined },
    step: { type: [Number, BigInt] as PropType<number | bigint>, default: 1 },
    hideControls: { type: Boolean, default: false },
    clampBehavior: { type: String as PropType<'strict' | 'blur' | 'none'>, default: 'blur' },
    allowDecimal: { type: Boolean, default: true },
    handlersRef: { type: [Object, Function] as PropType<any>, default: undefined },
    stepHoldDelay: { type: Number, default: undefined },
    stepHoldInterval: {
      type: [Number, Function] as PropType<number | ((t: number) => number)>,
      default: undefined,
    },
    startValue: { type: [Number, BigInt] as PropType<number | bigint>, default: 0 },
    withKeyboardEvents: { type: Boolean, default: true },
    trimLeadingZeroesOnBlur: { type: Boolean, default: true },
    selectAllOnFocus: { type: Boolean, default: false },
    onMinReached: { type: Function as PropType<() => void>, default: undefined },
    onMaxReached: { type: Function as PropType<() => void>, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    rightSection: {
      type: null as unknown as PropType<MantineNode>,
      default: undefined,
    },
    rightSectionWidth: { type: [String, Number] as PropType<string | number>, default: undefined },
    rightSectionPointerEvents: { type: String, default: undefined },
    label: { type: null as unknown as PropType<MantineNode>, default: undefined },
    description: { type: null as unknown as PropType<MantineNode>, default: undefined },
    error: {
      type: null as unknown as PropType<MantineNode | boolean>,
      default: undefined,
    },
    required: { type: Boolean, default: false },
    withAsterisk: { type: Boolean, default: undefined },
    wrapperProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const inputRef = ref<HTMLInputElement | null>(null)
    const isEditing = ref(false)
    const isBigIntMode = computed(
      () => typeof props.value === 'bigint' || typeof props.defaultValue === 'bigint',
    )
    const [value, setValue] = useUncontrolled<NumberInputValue>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: '',
      onChange: (nextValue) => props.onChange?.(nextValue),
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
      props.onValueChange?.(
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
        const start =
          typeof props.startValue === 'bigint' ? props.startValue : BigInt(props.startValue)
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
          props.onMaxReached?.()
        }

        if (min !== undefined && next < min) {
          props.onMinReached?.()
        }

        commitValue(clamped, direction === 1 ? 'increment' : 'decrement')
        return
      }

      const numeric = toNumeric(value.value)
      const step = typeof props.step === 'number' ? props.step : Number(props.step)
      const start =
        typeof props.startValue === 'number' ? props.startValue : Number(props.startValue)
      const base = typeof numeric === 'number' ? numeric : start
      const precision = Math.max(getDecimalPlaces(base), getDecimalPlaces(step))
      const factor = 10 ** precision
      const next = (Math.round(base * factor) + Math.round(step * factor) * direction) / factor
      const min = typeof props.min === 'number' ? props.min : !props.allowNegative ? 0 : undefined
      const max = typeof props.max === 'number' ? props.max : undefined
      const clamped = clamp(next, min, max)

      if (max !== undefined && next > max) {
        props.onMaxReached?.()
      }

      if (min !== undefined && next < min) {
        props.onMinReached?.()
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

    return () =>
      h(
        InputBase,
        {
          ...attrs,
          component: 'input',
          __staticSelector: 'NumberInput',
          __stylesApiProps: props,
          inputMode: isBigIntMode.value ? 'numeric' : 'decimal',
          type: 'text',
          value: displayValue.value,
          readOnly: props.readOnly,
          disabled: props.disabled,
          size: props.size,
          label: props.label,
          description: props.description,
          error: props.error,
          required: props.required,
          withAsterisk: props.withAsterisk,
          wrapperProps: props.wrapperProps,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
          rightSection:
            props.hideControls || props.readOnly
              ? props.rightSection
              : props.rightSection !== undefined || slots.rightSection
                ? props.rightSection
                : controls,
          rightSectionPointerEvents:
            props.rightSectionPointerEvents ?? (props.disabled ? 'none' : undefined),
          rightSectionWidth:
            props.rightSectionWidth ?? `var(--ni-right-section-width-${props.size || 'sm'})`,
          class: [classes.root, attrs.class],
          onInput: (event: Event) => {
            isEditing.value = true
            const input = event.currentTarget as HTMLInputElement
            const rawValue = stripFormatting(input.value, formatterOptions.value)
            const decimalSeparator = props.decimalSeparator || '.'
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

            const formattedNextValue =
              nextValue === '' || nextValue === '-'
                ? String(nextValue)
                : formatNumber(nextValue, getFormatterOptions(nextValue))

            if (input.value !== formattedNextValue) {
              restoreInputValue(input, formattedNextValue)
            }

            scheduleCaretClamp(input)
            commitValue(nextValue)
          },
          onKeydown: (event: KeyboardEvent) => {
            if (!props.readOnly && props.withKeyboardEvents && event.key === 'ArrowUp') {
              event.preventDefault()
              stepValue(1)
            }

            if (!props.readOnly && props.withKeyboardEvents && event.key === 'ArrowDown') {
              event.preventDefault()
              stepValue(-1)
            }

            scheduleCaretClamp(event.currentTarget as HTMLInputElement)
          },
          onKeyup: (event: KeyboardEvent) => {
            scheduleCaretClamp(event.currentTarget as HTMLInputElement)
          },
          onClick: (event: MouseEvent) => {
            scheduleCaretClamp(event.currentTarget as HTMLInputElement)
          },
          onFocus: (event: FocusEvent) => {
            isEditing.value = true

            if (props.selectAllOnFocus) {
              setTimeout(() => (event.currentTarget as HTMLInputElement).select(), 0)
            } else {
              scheduleCaretClamp(event.currentTarget as HTMLInputElement)
            }
          },
          onBlur: () => {
            isEditing.value = false
            let sanitizedValue = value.value
            const min = typeof props.min === 'number' ? props.min : undefined
            const max = typeof props.max === 'number' ? props.max : undefined

            if (props.clampBehavior === 'blur' && typeof sanitizedValue === 'number') {
              sanitizedValue = clamp(sanitizedValue, min, max)
            }

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
          },
          rootRef: (node: any) => {
            inputRef.value = node?.querySelector?.('input') ?? node
          },
        },
        slots,
      )
  },
})

Object.assign(NumberInput, { classes: { ...InputBase.classes, ...classes }, varsResolver })
