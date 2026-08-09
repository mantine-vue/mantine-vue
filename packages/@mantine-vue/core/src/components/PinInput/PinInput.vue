<script lang="ts">
import { createVarsResolver, getSize } from '../../core'

/** Character classes the fields can be restricted to. */
const regex = {
  number: /^[0-9]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/i,
}

const defaultProps = {
  gap: 'sm',
  length: 4,
  manageFocus: true,
  oneTimeCode: true,
  placeholder: '○',
  type: 'alphanumeric',
  ariaLabel: 'PinInput',
  size: 'sm',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: {
    '--pin-input-size': getSize(size ?? 'sm', 'pin-input-size'),
  },
}))

/**
 * `Input` renders a wrapper around the real field, so a ref to it is not the input
 * element. Both shapes are handled because the ref may already be the element.
 */
function getInputElement(node: any): HTMLInputElement | null {
  const element = node?.$el ?? node

  if (!element) {
    return null
  }

  if (typeof HTMLInputElement !== 'undefined' && element instanceof HTMLInputElement) {
    return element
  }

  return element.querySelector?.('input') ?? null
}

export { regex, defaultProps, varsResolver, getInputElement }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { assignRef, useId, useUncontrolled } from '@mantine-vue/hooks'
import { useProps, useStyles } from '../../core'
import { Group } from '../Group'
import { Input } from '../Input'
import { createPinArray } from './create-pin-array/create-pin-array'
import type { PinInputOwnProps } from './PinInput.types'
import classes from './PinInput.module.css'

defineOptions({
  name: 'PinInput',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<PinInputOwnProps>(), {
  manageFocus: undefined,
  oneTimeCode: undefined,
  autoFocus: false,
  disabled: false,
  error: false,
  mask: false,
  readOnly: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  complete: [value: string]
}>()

const attrs = useAttrs()
const props = useProps('PinInput', defaultProps, rawProps)

const uuid = useId(props.id)
const focusedIndex = ref(-1)
const inputsRef = ref<Array<HTMLInputElement | null>>([])

/** Guards `onComplete` so it fires once per completion, not on every keystroke after. */
const completed = ref(false)

const currentLength = computed(() => props.length ?? defaultProps.length)

const getStyles = useStyles({
  name: 'PinInput',
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

const [value, setValue] = useUncontrolled<string[]>({
  value: () =>
    props.modelValue !== undefined
      ? createPinArray(currentLength.value, props.modelValue ?? '')
      : undefined,
  defaultValue: props.defaultValue?.split('').slice(0, currentLength.value),
  finalValue: createPinArray(currentLength.value, ''),
  onChange: (nextValue) => {
    const stringValue = nextValue.join('').trim()
    emit('update:modelValue', stringValue)
    emit('change', stringValue)

    if (stringValue.length === currentLength.value && !completed.value) {
      completed.value = true
      emit('complete', stringValue)
    } else if (stringValue.length < currentLength.value) {
      completed.value = false
    }
  },
})

/** `length` can change at runtime, so the array is re-padded rather than trusted. */
const currentValue = computed(() =>
  value.value.length !== currentLength.value
    ? createPinArray(currentLength.value, value.value.join(''))
    : value.value,
)

const valueToString = computed(() => currentValue.value.join('').trim())

function validate(code: string) {
  const validator =
    props.type instanceof RegExp
      ? props.type
      : props.type && props.type in regex
        ? regex[props.type as keyof typeof regex]
        : null

  // An unrecognised `type` accepts everything rather than rejecting everything.
  return validator?.test(code) ?? true
}

function focusInputField(dir: 'next' | 'prev', index: number) {
  if (!props.manageFocus) {
    return
  }

  const nextIndex = dir === 'next' ? index + 1 : index - 1

  if (nextIndex >= 0 && nextIndex < currentLength.value) {
    inputsRef.value[nextIndex]?.focus()
  }
}

function setFieldValue(nextChar: string, index: number) {
  const nextValue = [...currentValue.value]
  nextValue[index] = nextChar
  setValue(nextValue)
  return nextValue
}

function handleInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  const inputValue = target.value

  if (inputValue.length > 1) {
    // More than two characters at once can only come from a paste or autofill, in which
    // case the whole code is distributed across the fields.
    const isPasteLike = inputValue.length > 2

    if (isPasteLike) {
      if (validate(inputValue)) {
        setValue(createPinArray(currentLength.value, inputValue))
        const filledCount = Math.min(inputValue.length, currentLength.value)

        if (filledCount < currentLength.value) {
          focusInputField('next', filledCount - 1)
        }
      }

      return
    }

    // Two characters means the user typed over a filled field; keep the newest one.
    const nextChar = inputValue.split('')[inputValue.length - 1]

    if (validate(nextChar)) {
      setFieldValue(nextChar, index)
      focusInputField('next', index)
    }

    return
  }

  if (inputValue.length === 1) {
    if (validate(inputValue)) {
      setFieldValue(inputValue, index)
      focusInputField('next', index)
    } else {
      setFieldValue('', index)
    }
  } else {
    setFieldValue('', index)
  }
}

function handleKeyDown(event: KeyboardEvent, index: number) {
  const inputValue = (event.target as HTMLInputElement).value

  // A numeric inputmode is only a hint on mobile, so non-digits are blocked explicitly.
  if (props.inputMode === 'numeric') {
    const allowedKeys = ['Backspace', 'Tab', 'Control', 'Delete', 'ArrowLeft', 'ArrowRight']
    const isModifierShortcut = event.ctrlKey || event.metaKey
    const isAllowedKey =
      allowedKeys.includes(event.key) || isModifierShortcut || !Number.isNaN(Number(event.key))

    if (!isAllowedKey) {
      event.preventDefault()
      return
    }
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusInputField('prev', index)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusInputField('next', index)
  } else if (event.key === 'Tab' && event.shiftKey && index > 0 && props.manageFocus) {
    event.preventDefault()
    focusInputField('prev', index)
  } else if (event.key === ' ') {
    event.preventDefault()
    focusInputField('next', index)
  } else if (event.key === 'Delete') {
    event.preventDefault()
    setFieldValue('', index)
  } else if (event.key === 'Backspace') {
    if (inputValue === '') {
      event.preventDefault()
      focusInputField('prev', index)
    } else {
      setFieldValue('', index)

      // On the last field the caret stays put, so the code can be retyped in place.
      if (index < currentLength.value - 1) {
        event.preventDefault()
        focusInputField('prev', index)
      }
    }
  } else if (inputValue.length > 0 && event.key === currentValue.value[index]) {
    // Retyping the character already in the field produces no `input` event, so the
    // focus has to be advanced here.
    event.preventDefault()
    focusInputField('next', index)
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasteData = event.clipboardData?.getData('text/plain').replace(/[\n\r\s]+/g, '') ?? ''

  if (validate(pasteData.trim())) {
    const pasteArray = createPinArray(currentLength.value, pasteData)
    setValue(pasteArray)
    const filledCount = pasteArray.filter(Boolean).length
    const nextIndex = filledCount >= currentLength.value ? currentLength.value - 1 : filledCount
    inputsRef.value[nextIndex]?.focus()
  }
}

function setRootRef(node: any) {
  assignRef(props.rootRef, node?.$el ?? node ?? null)
}

function setInputRef(node: any, index: number) {
  const input = getInputElement(node)
  inputsRef.value[index] = input

  if (index === 0) {
    assignRef(props.inputRef, input)
  }
}

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

/** The paddings and alignment are fixed, so a single character sits centred in a field. */
const pinInputStyles = computed(() =>
  getStyles('pinInput', {
    style: {
      '--input-padding': '0',
      '--input-text-align': 'center',
    },
  }),
)

const inputMode = computed(() => props.inputMode || (props.type === 'number' ? 'numeric' : 'text'))

const inputType = computed(
  () => props.inputType || (props.mask ? 'password' : props.type === 'number' ? 'tel' : 'text'),
)

function onFieldFocus(event: FocusEvent, index: number) {
  // Selecting the content makes typing replace the character instead of appending.
  ;(event.target as HTMLInputElement).select()
  focusedIndex.value = index
}
</script>

<template>
  <!-- `display: contents` keeps the hidden input out of the layout entirely. -->
  <div :style="{ display: 'contents' }">
    <Group
      :ref="setRootRef"
      v-bind="{ ...attrs, ...rootStyles }"
      role="group"
      :id="uuid"
      :gap="props.gap"
      wrap="nowrap"
      :variant="props.variant"
      dir="ltr"
      :unstyled="props.unstyled"
    >
      <Input
        v-for="(char, index) in currentValue"
        :key="`${uuid}-${index}`"
        :ref="(node: any) => setInputRef(node, index)"
        v-bind="{ ...pinInputStyles, ...(props.getInputProps?.(index) ?? {}) }"
        component="input"
        __static-selector="PinInput"
        :__styles-api-props="props"
        :id="`${uuid}-${index + 1}`"
        :input-mode="inputMode"
        :type="inputType"
        :radius="props.radius"
        :error="props.error"
        :variant="props.variant as any"
        :disabled="props.disabled"
        :autocomplete="props.oneTimeCode ? 'one-time-code' : 'off'"
        :placeholder="focusedIndex === index ? '' : props.placeholder"
        :model-value="char"
        :autofocus="props.autoFocus && index === 0"
        :unstyled="props.unstyled"
        :aria-label="props.ariaLabel"
        :readonly="props.readOnly"
        :class-names="props.classNames"
        :styles="props.styles"
        :vars="props.vars"
        :size="props.size"
        @input="(event: Event) => handleInput(event, index)"
        @keydown="(event: KeyboardEvent) => handleKeyDown(event, index)"
        @focus="(event: FocusEvent) => onFieldFocus(event, index)"
        @blur="focusedIndex = -1"
        @paste="handlePaste"
      />
    </Group>

    <input
      v-bind="props.hiddenInputProps"
      type="hidden"
      :name="props.name"
      :form="props.form"
      :value="valueToString"
    />
  </div>
</template>
