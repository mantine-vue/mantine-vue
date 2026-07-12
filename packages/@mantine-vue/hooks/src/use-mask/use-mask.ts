import { ref, watch, type Ref } from 'vue'

const DEFAULT_TOKENS: Record<string, RegExp> = {
  '9': /[0-9]/,
  a: /[A-Za-z]/,
  A: /[A-Z]/,
  '*': /[A-Za-z0-9]/,
  '#': /[-+0-9]/,
}

export interface UseMaskOptions {
  /** Mask pattern string or array of string literals and RegExp objects */
  mask: string | Array<string | RegExp>

  /** Override or extend the default token map */
  tokens?: Record<string, RegExp>

  /** Called before masking on each keystroke, can return overrides for mask options */
  modify?: (
    value: string,
  ) => Partial<Pick<UseMaskOptions, 'mask' | 'tokens' | 'slotChar' | 'separate'>> | undefined

  /** When true, raw and display values are decoupled */
  separate?: boolean

  /** Character displayed in unfilled slots, `"_"` by default */
  slotChar?: string | null

  /** Show mask pattern even when field is empty and unfocused */
  alwaysShowMask?: boolean

  /** Show mask placeholder on focus, `true` by default */
  showMaskOnFocus?: boolean

  /** Transform each character before validation and insertion */
  transform?: (char: string) => string

  /** Clear value on blur when mask is incomplete, `false` by default */
  autoClear?: boolean

  /** Sets aria-invalid on the input */
  invalid?: boolean

  /** Called on every change with raw and masked values */
  onChangeRaw?: (rawValue: string, maskedValue: string) => void

  /** Called when all required mask slots are filled */
  onComplete?: (maskedValue: string, rawValue: string) => void

  /** Escape hatch for advanced cursor/value manipulation */
  beforeMaskedStateChange?: (states: {
    previousState: MaskState
    currentState: MaskState
    nextState: MaskState
  }) => MaskState
}

export interface MaskState {
  value: string
  selection: { start: number; end: number } | null
}

export interface UseMaskReturnValue {
  /** Ref callback to attach to the input element */
  ref: (node: HTMLInputElement | null) => void

  /** Current masked display value */
  value: Ref<string>

  /** Current raw unmasked value */
  rawValue: Ref<string>

  /** Whether all required mask slots are filled */
  isComplete: Ref<boolean>

  /** Clear the input value and reset state */
  reset: () => void
}

interface MaskSlot {
  type: 'token' | 'literal'
  char: string
  pattern?: RegExp
  optional?: boolean
}

interface UndoState {
  rawValue: string
  selectionStart: number
}

const MAX_UNDO_HISTORY = 100

function parseMask(
  mask: string | Array<string | RegExp>,
  tokens: Record<string, RegExp>,
): MaskSlot[] {
  if (Array.isArray(mask)) {
    return mask.map((item) => {
      if (item instanceof RegExp) {
        return { type: 'token', char: '_', pattern: item }
      }
      return { type: 'literal', char: item }
    })
  }

  const slots: MaskSlot[] = []
  let optional = false

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i]

    if (char === '\\' && i + 1 < mask.length) {
      i++
      slots.push({ type: 'literal', char: mask[i] })
      continue
    }

    if (char === '?') {
      optional = true
      continue
    }

    if (tokens[char]) {
      slots.push({ type: 'token', char, pattern: tokens[char], optional })
    } else {
      slots.push({ type: 'literal', char, optional })
    }
  }

  return slots
}

function getSlotChar(slotCharOption: string | null | undefined, index: number): string {
  if (slotCharOption === null || slotCharOption === '' || slotCharOption === undefined) {
    return ''
  }
  if (slotCharOption.length > 1) {
    return slotCharOption[index] || '_'
  }
  return slotCharOption
}

function applyMaskToRaw(
  raw: string,
  slots: MaskSlot[],
  _slotCharOption: string | null | undefined,
  transform?: (char: string) => string,
): string {
  let result = ''
  let rawIndex = 0
  let slotIndex = 0

  for (slotIndex = 0; slotIndex < slots.length; slotIndex++) {
    const slot = slots[slotIndex]
    if (slot.type === 'literal') {
      result += slot.char
    } else if (rawIndex < raw.length) {
      const ch = transform ? transform(raw[rawIndex]) : raw[rawIndex]
      if (slot.pattern && slot.pattern.test(ch)) {
        result += ch
        rawIndex++
      } else {
        rawIndex++
        slotIndex--
      }
    } else {
      break
    }
  }

  return result
}

function buildDisplayValue(
  value: string,
  slots: MaskSlot[],
  slotCharOption: string | null | undefined,
  showSlots: boolean,
): string {
  if (!showSlots) {
    return value
  }

  let display = value

  for (let i = value.length; i < slots.length; i++) {
    const slot = slots[i]
    if (slot.type === 'literal') {
      display += slot.char
    } else {
      const sc = getSlotChar(slotCharOption, i)
      if (!sc) {
        break
      }
      display += sc
    }
  }

  return display
}

function extractRaw(masked: string, slots: MaskSlot[]): string {
  let raw = ''
  for (let i = 0; i < masked.length && i < slots.length; i++) {
    if (slots[i].type === 'token') {
      raw += masked[i]
    }
  }
  return raw
}

function checkComplete(masked: string, slots: MaskSlot[]): boolean {
  for (let i = 0; i < slots.length; i++) {
    if (slots[i].type === 'token' && !slots[i].optional) {
      if (i >= masked.length) {
        return false
      }
      if (!slots[i].pattern!.test(masked[i])) {
        return false
      }
    }
  }
  return true
}

function findNextTokenIndex(slots: MaskSlot[], from: number): number {
  for (let i = from; i < slots.length; i++) {
    if (slots[i].type === 'token') {
      return i
    }
  }
  return slots.length
}

function findPrevTokenIndex(slots: MaskSlot[], from: number): number {
  for (let i = from; i >= 0; i--) {
    if (slots[i].type === 'token') {
      return i
    }
  }
  return -1
}

function processInput(
  inputValue: string,
  slots: MaskSlot[],
  _slotCharOption: string | null | undefined,
): string {
  let result = ''
  let inputIndex = 0

  for (
    let slotIndex = 0;
    slotIndex < slots.length && inputIndex <= inputValue.length;
    slotIndex++
  ) {
    const slot = slots[slotIndex]

    if (slot.type === 'literal') {
      result += slot.char
      if (inputIndex < inputValue.length && inputValue[inputIndex] === slot.char) {
        inputIndex++
      }
      continue
    }

    if (inputIndex >= inputValue.length) {
      break
    }

    while (inputIndex < inputValue.length) {
      const ch = inputValue[inputIndex]
      inputIndex++

      if (slot.pattern!.test(ch)) {
        result += ch
        break
      }
    }

    if (result.length <= slotIndex) {
      break
    }
  }

  return result
}

function getResolvedOptions(options: UseMaskOptions, rawValue: string) {
  const tokens = { ...DEFAULT_TOKENS, ...options.tokens }
  let mask = options.mask
  let slotChar: string | null | undefined = options.slotChar === undefined ? '_' : options.slotChar
  let separate = options.separate ?? false

  if (options.modify) {
    const overrides = options.modify(rawValue)
    if (overrides) {
      if (overrides.mask !== undefined) {
        mask = overrides.mask
      }
      if (overrides.tokens !== undefined) {
        Object.assign(tokens, overrides.tokens)
      }
      if (overrides.slotChar !== undefined) {
        slotChar = overrides.slotChar
      }
      if (overrides.separate !== undefined) {
        separate = overrides.separate
      }
    }
  }

  const slots = parseMask(mask, tokens)
  return { slots, slotChar, separate, tokens, transform: options.transform }
}

export function formatMask(raw: string, options: UseMaskOptions): string {
  const { slots, slotChar, transform } = getResolvedOptions(options, raw)
  return applyMaskToRaw(raw, slots, slotChar, transform)
}

export function unformatMask(masked: string, options: UseMaskOptions): string {
  const { slots } = getResolvedOptions(options, '')
  return extractRaw(masked, slots)
}

export function isMaskComplete(masked: string, options: UseMaskOptions): boolean {
  const { slots } = getResolvedOptions(options, '')
  return checkComplete(masked, slots)
}

export function generatePattern(mode: 'full' | 'full-inexact', options: UseMaskOptions): string {
  const { slots } = getResolvedOptions(options, '')
  let pattern = ''

  for (const slot of slots) {
    if (slot.type === 'literal') {
      pattern += slot.char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    } else {
      const src = slot.pattern!.source
      if (mode === 'full-inexact') {
        pattern += slot.optional ? `${src}?` : src
      } else {
        pattern += slot.optional ? `(${src})?` : `(${src})`
      }
    }
  }

  return pattern
}

function findNextEditablePosition(from: number, slots: MaskSlot[], value: string): number {
  let pos = from
  while (pos < slots.length && pos < value.length && slots[pos] && slots[pos].type === 'literal') {
    pos++
  }
  return pos
}

export function useMask(options: UseMaskOptions): UseMaskReturnValue {
  let node: HTMLInputElement | null = null

  const maskedValue = ref('') as Ref<string>
  const rawValue = ref('') as Ref<string>
  const isComplete = ref(false) as Ref<boolean>

  let processed = ''
  let display = ''
  let rawInternal = ''
  let wasComplete = false
  let isFocused = false
  let undoStack: UndoState[] = []
  let redoStack: UndoState[] = []

  const applyValue = (input: {
    reprocessed: string
    newRaw: string
    displayValue: string
    resolvedSlots: MaskSlot[]
    cursorPos?: number
    notifyChange: boolean
  }) => {
    const { reprocessed, newRaw, displayValue, resolvedSlots, cursorPos, notifyChange } = input

    processed = reprocessed
    display = displayValue
    rawInternal = newRaw
    maskedValue.value = displayValue
    rawValue.value = newRaw

    if (node) {
      node.value = displayValue
      if (cursorPos !== undefined && document.activeElement === node) {
        const pos = Math.min(cursorPos, reprocessed.length)
        node.setSelectionRange(pos, pos)
      }
    }

    if (notifyChange && options.onChangeRaw) {
      options.onChangeRaw(newRaw, displayValue)
    }

    const complete = checkComplete(reprocessed, resolvedSlots)
    if (notifyChange && complete && !wasComplete && options.onComplete) {
      options.onComplete(displayValue, newRaw)
    }
    wasComplete = complete
    isComplete.value = complete
  }

  const updateValue = (newMasked: string, cursorPos?: number) => {
    const { slots } = getResolvedOptions(
      options,
      extractRaw(newMasked, getResolvedOptions(options, '').slots),
    )
    const raw = extractRaw(newMasked, slots)

    const { slots: resolvedSlots, slotChar } = getResolvedOptions(options, raw)

    const reprocessed = processInput(newMasked, resolvedSlots, slotChar)
    const newRaw = extractRaw(reprocessed, resolvedSlots)

    const showSlots = options.alwaysShowMask || isFocused
    const showOnFocus = options.showMaskOnFocus !== false
    const shouldShowSlots = showSlots && (showOnFocus || reprocessed.length > 0)

    const displayValue = buildDisplayValue(reprocessed, resolvedSlots, slotChar, shouldShowSlots)

    applyValue({ reprocessed, newRaw, displayValue, resolvedSlots, cursorPos, notifyChange: true })

    return { displayValue, newRaw, reprocessed, resolvedSlots }
  }

  const initializeInputValue = (inputNode: HTMLInputElement): boolean => {
    if (!inputNode.value) {
      return false
    }

    const { slots: initialSlots, slotChar: initialSlotChar } = getResolvedOptions(options, '')
    const initialProcessed = processInput(inputNode.value, initialSlots, initialSlotChar)
    const initialRaw = extractRaw(initialProcessed, initialSlots)
    const { slots: resolvedSlots, slotChar } = getResolvedOptions(options, initialRaw)
    const reprocessed = processInput(inputNode.value, resolvedSlots, slotChar)
    const newRaw = extractRaw(reprocessed, resolvedSlots)
    const showSlots = options.alwaysShowMask || isFocused
    const showOnFocus = options.showMaskOnFocus !== false
    const shouldShowSlots = showSlots && (showOnFocus || reprocessed.length > 0)
    const displayValue = buildDisplayValue(reprocessed, resolvedSlots, slotChar, shouldShowSlots)

    applyValue({ reprocessed, newRaw, displayValue, resolvedSlots, notifyChange: false })

    return true
  }

  const pushUndoState = () => {
    const selectionStart = node?.selectionStart ?? rawInternal.length
    const state: UndoState = { rawValue: rawInternal, selectionStart }
    const top = undoStack[undoStack.length - 1]
    if (top && top.rawValue === state.rawValue && top.selectionStart === state.selectionStart) {
      return
    }
    undoStack.push(state)
    if (undoStack.length > MAX_UNDO_HISTORY) {
      undoStack.shift()
    }
    redoStack = []
  }

  const applyHistoryState = (target: UndoState) => {
    const { slots, slotChar, transform } = getResolvedOptions(options, target.rawValue)
    const newMasked = applyMaskToRaw(target.rawValue, slots, slotChar, transform)
    updateValue(newMasked, target.selectionStart)
  }

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement

    const { slots: resolvedSlots, slotChar, transform } = getResolvedOptions(options, '')
    const prev = display
    const curr = input.value

    let prefixLen = 0
    const maxPrefix = Math.min(prev.length, curr.length)
    while (prefixLen < maxPrefix && prev[prefixLen] === curr[prefixLen]) {
      prefixLen++
    }

    let suffixLen = 0
    const maxSuffix = Math.min(prev.length - prefixLen, curr.length - prefixLen)
    while (
      suffixLen < maxSuffix &&
      prev[prev.length - 1 - suffixLen] === curr[curr.length - 1 - suffixLen]
    ) {
      suffixLen++
    }

    const insertedText = curr.slice(prefixLen, curr.length - suffixLen)
    const removedEnd = prev.length - suffixLen

    const beforeRaw = extractRaw(prev.slice(0, prefixLen), resolvedSlots.slice(0, prefixLen))
    const afterRaw = extractRaw(prev.slice(removedEnd), resolvedSlots.slice(removedEnd))
    const reformatted = applyMaskToRaw(
      beforeRaw + insertedText + afterRaw,
      resolvedSlots,
      slotChar,
      transform,
    )
    const maskedPrefix = applyMaskToRaw(
      beforeRaw + insertedText,
      resolvedSlots,
      slotChar,
      transform,
    )

    if (reformatted !== prev) {
      pushUndoState()
    }
    updateValue(reformatted, maskedPrefix.length)
  }

  const clampCursorToProcessed = (input: HTMLInputElement) => {
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    if (start !== end) {
      return
    }

    const { slots } = getResolvedOptions(options, '')
    const endPos =
      processed.length > 0
        ? findNextEditablePosition(processed.length, slots, processed)
        : findNextTokenIndex(slots, 0)
    const startPos = findNextTokenIndex(slots, 0)

    if (start > endPos || start < startPos) {
      input.setSelectionRange(endPos, endPos)
    }
  }

  const handleFocus = () => {
    isFocused = true
    const input = node

    if (!input) {
      return
    }

    const { slots, slotChar } = getResolvedOptions(options, '')
    const showOnFocus = options.showMaskOnFocus !== false

    if (showOnFocus || options.alwaysShowMask) {
      const nextDisplay = buildDisplayValue(processed, slots, slotChar, true)
      input.value = nextDisplay
      display = nextDisplay
      maskedValue.value = nextDisplay
    }

    requestAnimationFrame(() => {
      if (input === document.activeElement) {
        clampCursorToProcessed(input)
      }
    })
  }

  const handleMouseUp = () => {
    const input = node
    if (!input || input !== document.activeElement) {
      return
    }

    clampCursorToProcessed(input)
  }

  const handleMouseDown = () => {
    const input = node
    if (!input) {
      return
    }

    requestAnimationFrame(() => {
      if (input !== document.activeElement) {
        return
      }

      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0
      if (start !== end) {
        return
      }

      const { slots } = getResolvedOptions(options, '')
      const endPos =
        processed.length > 0
          ? findNextEditablePosition(processed.length, slots, processed)
          : findNextTokenIndex(slots, 0)

      if (start > endPos) {
        input.setSelectionRange(endPos, endPos)
      }
    })
  }

  const handleBlur = () => {
    isFocused = false
    const input = node

    if (!input) {
      return
    }

    const { slots, slotChar } = getResolvedOptions(options, rawInternal)
    const expectedFocusDisplay = buildDisplayValue(processed, slots, slotChar, true)
    const nextProcessed =
      input.value === expectedFocusDisplay ? processed : processInput(input.value, slots, slotChar)
    const complete = checkComplete(nextProcessed, slots)

    if (options.autoClear && !complete && nextProcessed.length > 0) {
      input.value = ''
      processed = ''
      display = ''
      rawInternal = ''
      maskedValue.value = ''
      rawValue.value = ''
      wasComplete = false
      isComplete.value = false

      if (options.onChangeRaw) {
        options.onChangeRaw('', '')
      }

      if (options.alwaysShowMask) {
        const emptyDisplay = buildDisplayValue('', slots, slotChar, true)
        input.value = emptyDisplay
        display = emptyDisplay
        maskedValue.value = emptyDisplay
      }
      return
    }

    if (!options.alwaysShowMask && !complete) {
      if (extractRaw(nextProcessed, slots).length === 0) {
        input.value = ''
        processed = ''
        display = ''
        rawInternal = ''
        maskedValue.value = ''
        rawValue.value = ''
        wasComplete = false
        isComplete.value = false

        if (options.onChangeRaw) {
          options.onChangeRaw('', '')
        }
        return
      }

      const nextDisplay = buildDisplayValue(nextProcessed, slots, slotChar, false)
      input.value = nextDisplay
      display = nextDisplay
      maskedValue.value = nextDisplay
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement

    const { slots, slotChar, transform } = getResolvedOptions(options, rawInternal)
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0

    const modifier = e.metaKey || (e.ctrlKey && !e.altKey)
    const key = e.key.toLowerCase()

    if (modifier && key === 'z' && !e.shiftKey) {
      e.preventDefault()
      const prev = undoStack.pop()
      if (!prev) {
        return
      }
      redoStack.push({ rawValue: rawInternal, selectionStart: input.selectionStart ?? 0 })
      applyHistoryState(prev)
      return
    }

    if (modifier && ((key === 'z' && e.shiftKey) || (key === 'y' && !e.shiftKey))) {
      e.preventDefault()
      const next = redoStack.pop()
      if (!next) {
        return
      }
      undoStack.push({ rawValue: rawInternal, selectionStart: input.selectionStart ?? 0 })
      applyHistoryState(next)
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()

      if (e.metaKey || (e.ctrlKey && !e.altKey)) {
        const clampedStart = Math.min(start, processed.length)
        const afterRaw = extractRaw(processed.slice(clampedStart), slots.slice(clampedStart))
        const newValue = applyMaskToRaw(afterRaw, slots, slotChar, transform)
        pushUndoState()
        updateValue(newValue, 0)
        return
      }

      if (start !== end) {
        const clampedEnd = Math.min(end, processed.length)
        const before = processed.slice(0, start)
        const afterRaw = extractRaw(processed.slice(clampedEnd), slots.slice(clampedEnd))
        const newValue = applyMaskToRaw(
          extractRaw(before, slots) + afterRaw,
          slots,
          slotChar,
          transform,
        )
        pushUndoState()
        updateValue(newValue, start)
        return
      }

      if (start === 0) {
        return
      }

      let deletePos = start - 1
      while (deletePos >= 0 && slots[deletePos] && slots[deletePos].type === 'literal') {
        deletePos--
      }

      if (deletePos < 0) {
        return
      }

      const beforeRaw = extractRaw(processed.slice(0, deletePos), slots.slice(0, deletePos))
      const afterRaw = extractRaw(processed.slice(deletePos + 1), slots.slice(deletePos + 1))
      const newValue = applyMaskToRaw(beforeRaw + afterRaw, slots, slotChar, transform)
      pushUndoState()
      updateValue(newValue, deletePos)
    } else if (e.key === 'Delete') {
      e.preventDefault()

      if (start !== end) {
        const clampedEnd = Math.min(end, processed.length)
        const before = processed.slice(0, start)
        const afterRaw = extractRaw(processed.slice(clampedEnd), slots.slice(clampedEnd))
        const newValue = applyMaskToRaw(
          extractRaw(before, slots) + afterRaw,
          slots,
          slotChar,
          transform,
        )
        pushUndoState()
        updateValue(newValue, start)
        return
      }

      let deletePos = start
      while (deletePos < slots.length && slots[deletePos] && slots[deletePos].type === 'literal') {
        deletePos++
      }

      if (deletePos >= processed.length) {
        return
      }

      const beforeRaw = extractRaw(processed.slice(0, start), slots.slice(0, start))
      const afterRaw = extractRaw(processed.slice(deletePos + 1), slots.slice(deletePos + 1))
      const newValue = applyMaskToRaw(beforeRaw + afterRaw, slots, slotChar, transform)
      pushUndoState()
      updateValue(newValue, start)
    } else if (e.key === 'ArrowRight' && !e.shiftKey) {
      const nextPos = findNextEditablePosition(start + 1, slots, input.value)
      if (nextPos !== start + 1) {
        e.preventDefault()
        input.setSelectionRange(nextPos, nextPos)
      }
    } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
      if (start > 0) {
        const prevToken = findPrevTokenIndex(slots, start - 1)
        if (prevToken >= 0 && prevToken !== start - 1) {
          e.preventDefault()
          input.setSelectionRange(prevToken + 1, prevToken + 1)
        }
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()

      let insertPos = Math.min(start, processed.length)
      while (insertPos < slots.length && slots[insertPos] && slots[insertPos].type === 'literal') {
        insertPos++
      }

      if (insertPos >= slots.length) {
        return
      }

      const slot = slots[insertPos]
      const ch = transform ? transform(e.key) : e.key
      if (!slot.pattern!.test(ch)) {
        return
      }

      const beforeRaw = extractRaw(processed.slice(0, insertPos), slots.slice(0, insertPos))
      const afterRaw =
        start < end
          ? extractRaw(
              processed.slice(Math.min(end, processed.length)),
              slots.slice(Math.min(end, processed.length)),
            )
          : extractRaw(processed.slice(insertPos), slots.slice(insertPos))
      const newValue = applyMaskToRaw(beforeRaw + ch + afterRaw, slots, slotChar, transform)
      const newCursorPos = findNextEditablePosition(insertPos + 1, slots, newValue)
      pushUndoState()
      updateValue(newValue, newCursorPos)
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const input = e.target as HTMLInputElement

    const pastedText = e.clipboardData?.getData('text') ?? ''
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0

    const { slots, slotChar, transform } = getResolvedOptions(options, '')
    const clampedStart = Math.min(start, processed.length)
    const clampedEnd = Math.min(end, processed.length)
    const beforeRaw = extractRaw(processed.slice(0, clampedStart), slots.slice(0, clampedStart))
    const afterRaw = extractRaw(processed.slice(clampedEnd), slots.slice(clampedEnd))
    const newValue = applyMaskToRaw(beforeRaw + pastedText + afterRaw, slots, slotChar, transform)

    pushUndoState()
    updateValue(newValue)

    const maskedPrefix = applyMaskToRaw(beforeRaw + pastedText, slots, slotChar, transform)
    const pasteEndPos = Math.min(maskedPrefix.length, slots.length)
    if (input === document.activeElement) {
      input.setSelectionRange(pasteEndPos, pasteEndPos)
    }
  }

  const setAriaAttributes = (input: HTMLInputElement) => {
    if (options.invalid) {
      input.setAttribute('aria-invalid', 'true')
    } else {
      input.removeAttribute('aria-invalid')
    }
  }

  const refCallback = (newNode: HTMLElement | null) => {
    const prevNode = node

    if (prevNode) {
      prevNode.removeEventListener('input', handleInput)
      prevNode.removeEventListener('focus', handleFocus)
      prevNode.removeEventListener('blur', handleBlur)
      prevNode.removeEventListener('mousedown', handleMouseDown)
      prevNode.removeEventListener('mouseup', handleMouseUp)
      prevNode.removeEventListener('keydown', handleKeyDown as EventListener)
      prevNode.removeEventListener('paste', handlePaste as EventListener)
    }

    const inputNode =
      newNode instanceof HTMLInputElement
        ? newNode
        : newNode?.querySelector<HTMLInputElement>('input')

    node = inputNode ?? null

    if (inputNode) {
      inputNode.addEventListener('input', handleInput)
      inputNode.addEventListener('focus', handleFocus)
      inputNode.addEventListener('blur', handleBlur)
      inputNode.addEventListener('mousedown', handleMouseDown)
      inputNode.addEventListener('mouseup', handleMouseUp)
      inputNode.addEventListener('keydown', handleKeyDown as EventListener)
      inputNode.addEventListener('paste', handlePaste as EventListener)

      setAriaAttributes(inputNode)

      const hasInitialValue = initializeInputValue(inputNode)

      if (options.alwaysShowMask && !hasInitialValue) {
        const { slots, slotChar } = getResolvedOptions(options, '')
        const displayValue = buildDisplayValue('', slots, slotChar, true)
        inputNode.value = displayValue
        display = displayValue
        maskedValue.value = displayValue
      }
    }
  }

  watch(
    () => options.invalid,
    () => {
      if (node) {
        setAriaAttributes(node)
      }
    },
  )

  const reset = () => {
    processed = ''
    display = ''
    rawInternal = ''
    undoStack = []
    redoStack = []
    maskedValue.value = ''
    rawValue.value = ''
    wasComplete = false
    isComplete.value = false

    if (node) {
      if (options.alwaysShowMask) {
        const { slots, slotChar } = getResolvedOptions(options, '')
        const displayValue = buildDisplayValue('', slots, slotChar, true)
        node.value = displayValue
        display = displayValue
        maskedValue.value = displayValue
      } else {
        node.value = ''
      }
    }

    if (options.onChangeRaw) {
      options.onChangeRaw('', '')
    }
  }

  return {
    ref: refCallback,
    value: maskedValue,
    rawValue,
    isComplete,
    reset,
  }
}
