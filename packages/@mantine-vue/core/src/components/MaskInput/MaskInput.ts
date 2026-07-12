import { defineComponent, h, onBeforeUnmount, ref, watch, type PropType } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { InputBase } from '../InputBase'
import {
  applyMaskToRaw,
  buildDisplayValue,
  extractRaw,
  isComplete,
  nextToken,
  previousToken,
  processInput,
  resolveMaskOptions,
  type MaskInputMask,
  type MaskInputState,
} from './use-mask-input'

export interface MaskInputProps {
  mask: MaskInputMask
  tokens?: Record<string, RegExp>
  modify?: (
    value: string,
  ) => Partial<Pick<MaskInputProps, 'mask' | 'tokens' | 'slotChar' | 'separate'>> | undefined
  separate?: boolean
  slotChar?: string | null
  alwaysShowMask?: boolean
  showMaskOnFocus?: boolean
  transform?: (char: string) => string
  autoClear?: boolean
  onChangeRaw?: (rawValue: string, maskedValue: string) => void
  onComplete?: (maskedValue: string, rawValue: string) => void
  beforeMaskedStateChange?: (states: {
    previousState: MaskInputState
    currentState: MaskInputState
    nextState: MaskInputState
  }) => MaskInputState
  resetRef?: any
}

function callHandler(handler: unknown, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else if (typeof handler === 'function') {
    handler(event)
  }
}

export const MaskInput = defineComponent({
  name: 'MaskInput',
  inheritAttrs: false,
  props: {
    mask: { type: [String, Array] as PropType<MaskInputMask>, required: true },
    tokens: { type: Object as PropType<Record<string, RegExp>>, default: undefined },
    modify: { type: Function as PropType<MaskInputProps['modify']>, default: undefined },
    separate: { type: Boolean, default: false },
    slotChar: { type: String as PropType<string | null>, default: '_' },
    alwaysShowMask: { type: Boolean, default: false },
    showMaskOnFocus: { type: Boolean, default: true },
    transform: { type: Function as PropType<(char: string) => string>, default: undefined },
    autoClear: { type: Boolean, default: false },
    onChangeRaw: {
      type: Function as PropType<(raw: string, masked: string) => void>,
      default: undefined,
    },
    onComplete: {
      type: Function as PropType<(masked: string, raw: string) => void>,
      default: undefined,
    },
    beforeMaskedStateChange: {
      type: Function as PropType<MaskInputProps['beforeMaskedStateChange']>,
      default: undefined,
    },
    resetRef: { type: [Object, Function] as PropType<any>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const input = ref<HTMLInputElement | null>(null)
    const processed = ref('')
    const rawValue = ref('')
    const displayValue = ref('')
    const focused = ref(false)
    const wasComplete = ref(false)

    const options = () => ({
      mask: props.mask,
      tokens: props.tokens,
      modify: props.modify,
      separate: props.separate,
      slotChar: props.slotChar,
      transform: props.transform,
    })

    const selection = (element = input.value): MaskInputState['selection'] =>
      element ? { start: element.selectionStart ?? 0, end: element.selectionEnd ?? 0 } : null

    const commit = (masked: string, cursor?: number, notify = true, currentValue?: string) => {
      const initial = resolveMaskOptions(options(), rawValue.value)
      const nextProcessed = processInput(masked, initial.slots, initial.transform)
      const nextRaw = extractRaw(nextProcessed, initial.slots)
      const resolved = resolveMaskOptions(options(), nextRaw)
      const reprocessed = processInput(masked, resolved.slots, resolved.transform)
      const resolvedRaw = extractRaw(reprocessed, resolved.slots)
      const showSlots = props.alwaysShowMask || (focused.value && props.showMaskOnFocus)
      let nextDisplay = buildDisplayValue(reprocessed, resolved.slots, resolved.slotChar, showSlots)
      let nextSelection = cursor === undefined ? selection() : { start: cursor, end: cursor }

      if (props.beforeMaskedStateChange) {
        const changed = props.beforeMaskedStateChange({
          previousState: { value: displayValue.value, selection: selection() },
          currentState: {
            value: currentValue ?? input.value?.value ?? displayValue.value,
            selection: selection(),
          },
          nextState: { value: nextDisplay, selection: nextSelection },
        })
        nextDisplay = changed.value
        nextSelection = changed.selection
      }

      processed.value = reprocessed
      rawValue.value = resolvedRaw
      displayValue.value = nextDisplay
      if (input.value) {
        input.value.value = nextDisplay
        if (nextSelection && document.activeElement === input.value) {
          const position = Math.min(nextSelection.start, reprocessed.length)
          input.value.setSelectionRange(position, Math.min(nextSelection.end, reprocessed.length))
        }
      }

      const complete = isComplete(reprocessed, resolved.slots)
      if (notify) {
        props.onChangeRaw?.(resolvedRaw, nextDisplay)
        if (complete && !wasComplete.value) {
          props.onComplete?.(nextDisplay, resolvedRaw)
        }
      }
      wasComplete.value = complete
    }

    const reset = () => {
      processed.value = ''
      rawValue.value = ''
      wasComplete.value = false
      const resolved = resolveMaskOptions(options(), '')
      displayValue.value = props.alwaysShowMask
        ? buildDisplayValue('', resolved.slots, resolved.slotChar, true)
        : ''
      if (input.value) {
        input.value.value = displayValue.value
      }
      props.onChangeRaw?.('', '')
    }

    assignRef(props.resetRef, reset)
    watch(
      () => props.resetRef,
      (value) => assignRef(value, reset),
    )
    watch(
      () => (attrs as any).value,
      (value) => {
        if (input.value && value !== undefined && String(value) !== displayValue.value) {
          commit(String(value), undefined, false, String(value))
        }
      },
    )
    onBeforeUnmount(() => assignRef(props.resetRef, null))

    const attach = (root: any) => {
      const element = (root?.$el ?? root)?.querySelector?.('input') ?? root?.$el ?? root
      input.value = element instanceof HTMLInputElement ? element : null
      assignRef((attrs as any).rootRef, root?.$el ?? root ?? null)

      if (!input.value) {
        return
      }

      const initial = (attrs as any).value ?? (attrs as any).defaultValue ?? input.value.value
      if (initial) {
        commit(String(initial), undefined, false, String(initial))
      } else if (props.alwaysShowMask) {
        const resolved = resolveMaskOptions(options(), '')
        displayValue.value = buildDisplayValue('', resolved.slots, resolved.slotChar, true)
        input.value.value = displayValue.value
      }
    }

    const handleInput = (event: Event) => {
      const element = event.currentTarget as HTMLInputElement
      const previous = displayValue.value
      const current = element.value
      let prefix = 0
      while (
        prefix < previous.length &&
        prefix < current.length &&
        previous[prefix] === current[prefix]
      )
        prefix++
      let suffix = 0
      while (
        suffix < previous.length - prefix &&
        suffix < current.length - prefix &&
        previous[previous.length - 1 - suffix] === current[current.length - 1 - suffix]
      )
        suffix++

      const resolved = resolveMaskOptions(options(), rawValue.value)
      const removedEnd = previous.length - suffix
      const before = extractRaw(previous.slice(0, prefix), resolved.slots.slice(0, prefix))
      const after = extractRaw(previous.slice(removedEnd), resolved.slots.slice(removedEnd))
      const inserted = current.slice(prefix, current.length - suffix)
      const next = applyMaskToRaw(before + inserted + after, resolved.slots, resolved.transform)
      const maskedPrefix = applyMaskToRaw(before + inserted, resolved.slots, resolved.transform)
      commit(next, maskedPrefix.length, true, current)
      callHandler((attrs as any).onInput, event)
    }

    const handleFocus = (event: FocusEvent) => {
      focused.value = true
      const resolved = resolveMaskOptions(options(), rawValue.value)
      if (props.showMaskOnFocus || props.alwaysShowMask) {
        displayValue.value = buildDisplayValue(
          processed.value,
          resolved.slots,
          resolved.slotChar,
          true,
        )
        ;(event.currentTarget as HTMLInputElement).value = displayValue.value
      }
      requestAnimationFrame(() => {
        const start = nextToken(resolved.slots, 0)
        const end = processed.value.length || start
        const element = event.currentTarget as HTMLInputElement
        if (
          document.activeElement === element &&
          ((element.selectionStart ?? 0) < start || (element.selectionStart ?? 0) > end)
        ) {
          element.setSelectionRange(end, end)
        }
      })
      callHandler((attrs as any).onFocus, event)
    }

    const handleBlur = (event: FocusEvent) => {
      focused.value = false
      const resolved = resolveMaskOptions(options(), rawValue.value)
      const complete = isComplete(processed.value, resolved.slots)
      if (props.autoClear && !complete && rawValue.value) {
        reset()
      } else if (!props.alwaysShowMask) {
        displayValue.value = rawValue.value ? processed.value : ''
        ;(event.currentTarget as HTMLInputElement).value = displayValue.value
      }
      callHandler((attrs as any).onBlur, event)
      callHandler((attrs as any).onChange, event)
    }

    const handleKeydown = (event: KeyboardEvent) => {
      const element = event.currentTarget as HTMLInputElement
      const resolved = resolveMaskOptions(options(), rawValue.value)
      const start = element.selectionStart ?? 0
      const end = element.selectionEnd ?? start

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault()
        let deleteStart = start
        let deleteEnd = end
        if (start === end) {
          const token =
            event.key === 'Backspace'
              ? previousToken(resolved.slots, start - 1)
              : nextToken(resolved.slots, start)
          if (token < 0 || token >= processed.value.length) return
          deleteStart = token
          deleteEnd = token + 1
        }
        const before = extractRaw(
          processed.value.slice(0, deleteStart),
          resolved.slots.slice(0, deleteStart),
        )
        const after = extractRaw(processed.value.slice(deleteEnd), resolved.slots.slice(deleteEnd))
        commit(applyMaskToRaw(before + after, resolved.slots, resolved.transform), deleteStart)
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        const position = nextToken(resolved.slots, Math.min(start, processed.value.length))
        if (position >= resolved.slots.length) return
        const character = resolved.transform ? resolved.transform(event.key) : event.key
        resolved.slots[position].pattern!.lastIndex = 0
        if (!resolved.slots[position].pattern!.test(character)) return
        const before = extractRaw(
          processed.value.slice(0, position),
          resolved.slots.slice(0, position),
        )
        const after = extractRaw(processed.value.slice(end), resolved.slots.slice(end))
        const next = applyMaskToRaw(before + character + after, resolved.slots, resolved.transform)
        commit(next, nextToken(resolved.slots, position + 1))
      }
      callHandler((attrs as any).onKeydown, event)
    }

    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault()
      const element = event.currentTarget as HTMLInputElement
      const resolved = resolveMaskOptions(options(), rawValue.value)
      const start = Math.min(element.selectionStart ?? 0, processed.value.length)
      const end = Math.min(element.selectionEnd ?? start, processed.value.length)
      const before = extractRaw(processed.value.slice(0, start), resolved.slots.slice(0, start))
      const after = extractRaw(processed.value.slice(end), resolved.slots.slice(end))
      const pasted = event.clipboardData?.getData('text') ?? ''
      const next = applyMaskToRaw(before + pasted + after, resolved.slots, resolved.transform)
      const pasteEnd = applyMaskToRaw(before + pasted, resolved.slots, resolved.transform).length
      commit(next, pasteEnd)
      callHandler((attrs as any).onPaste, event)
    }

    return () => {
      const forwarded = { ...attrs } as Record<string, any>
      delete forwarded.rootRef
      delete forwarded.onInput
      delete forwarded.onFocus
      delete forwarded.onBlur
      delete forwarded.onChange
      delete forwarded.onKeydown
      delete forwarded.onPaste
      delete forwarded.value
      delete forwarded.defaultValue

      return h(
        InputBase,
        {
          ...forwarded,
          component: 'input',
          type: forwarded.type ?? 'text',
          __staticSelector: 'MaskInput',
          __stylesApiProps: attrs,
          rootRef: attach,
          onInput: handleInput,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onKeydown: handleKeydown,
          onPaste: handlePaste,
        },
        slots,
      )
    }
  },
})

Object.assign(MaskInput, { classes: InputBase.classes })
