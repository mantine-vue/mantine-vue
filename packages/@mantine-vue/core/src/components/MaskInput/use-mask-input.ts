export type MaskInputMask = string | Array<string | RegExp>

export interface MaskInputState {
  value: string
  selection: { start: number; end: number } | null
}

export interface MaskOptions {
  mask: MaskInputMask
  tokens?: Record<string, RegExp>
  modify?: (
    value: string,
  ) => Partial<Pick<MaskOptions, 'mask' | 'tokens' | 'slotChar' | 'separate'>> | undefined
  separate?: boolean
  slotChar?: string | null
  transform?: (char: string) => string
}

export interface MaskSlot {
  type: 'token' | 'literal'
  char: string
  pattern?: RegExp
  optional?: boolean
}

const DEFAULT_TOKENS: Record<string, RegExp> = {
  '9': /[0-9]/,
  a: /[A-Za-z]/,
  A: /[A-Z]/,
  '*': /[A-Za-z0-9]/,
  '#': /[-+0-9]/,
}

function matches(pattern: RegExp, value: string) {
  pattern.lastIndex = 0
  return pattern.test(value)
}

export function parseMask(mask: MaskInputMask, tokens: Record<string, RegExp>): MaskSlot[] {
  if (Array.isArray(mask)) {
    return mask.map((item) =>
      item instanceof RegExp
        ? { type: 'token', char: '_', pattern: item }
        : { type: 'literal', char: item },
    )
  }

  const slots: MaskSlot[] = []
  let optional = false

  for (let index = 0; index < mask.length; index++) {
    const char = mask[index]

    if (char === '\\' && index + 1 < mask.length) {
      slots.push({ type: 'literal', char: mask[++index] })
    } else if (char === '?') {
      optional = true
    } else if (tokens[char]) {
      slots.push({ type: 'token', char, pattern: tokens[char], optional })
    } else {
      slots.push({ type: 'literal', char, optional })
    }
  }

  return slots
}

export function resolveMaskOptions(options: MaskOptions, rawValue: string) {
  const tokens = { ...DEFAULT_TOKENS, ...options.tokens }
  let mask = options.mask
  let slotChar = options.slotChar === undefined ? '_' : options.slotChar
  let separate = options.separate ?? false
  const overrides = options.modify?.(rawValue)

  if (overrides) {
    mask = overrides.mask ?? mask
    Object.assign(tokens, overrides.tokens)
    slotChar = overrides.slotChar === undefined ? slotChar : overrides.slotChar
    separate = overrides.separate ?? separate
  }

  return { slots: parseMask(mask, tokens), slotChar, separate, transform: options.transform }
}

export function applyMaskToRaw(
  raw: string,
  slots: MaskSlot[],
  transform?: (char: string) => string,
) {
  let result = ''
  let rawIndex = 0

  for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
    const slot = slots[slotIndex]

    if (slot.type === 'literal') {
      result += slot.char
      continue
    }

    let accepted = false
    while (rawIndex < raw.length && !accepted) {
      const char = transform ? transform(raw[rawIndex++]) : raw[rawIndex++]
      if (matches(slot.pattern!, char)) {
        result += char
        accepted = true
      }
    }

    if (!accepted) {
      break
    }
  }

  return result
}

export function processInput(
  input: string,
  slots: MaskSlot[],
  transform?: (char: string) => string,
) {
  let raw = ''
  let inputIndex = 0

  for (const slot of slots) {
    if (slot.type === 'literal') {
      if (input[inputIndex] === slot.char) {
        inputIndex++
      }
      continue
    }

    while (inputIndex < input.length) {
      const candidate = transform ? transform(input[inputIndex++]) : input[inputIndex++]
      if (matches(slot.pattern!, candidate)) {
        raw += candidate
        break
      }
    }
  }

  return applyMaskToRaw(raw, slots, transform)
}

export function extractRaw(masked: string, slots: MaskSlot[]) {
  let raw = ''
  for (let index = 0; index < masked.length && index < slots.length; index++) {
    if (slots[index].type === 'token' && matches(slots[index].pattern!, masked[index])) {
      raw += masked[index]
    }
  }
  return raw
}

export function buildDisplayValue(
  value: string,
  slots: MaskSlot[],
  slotChar: string | null | undefined,
  show: boolean,
) {
  if (!show) {
    return value
  }

  let display = value
  for (let index = value.length; index < slots.length; index++) {
    const slot = slots[index]
    if (slot.type === 'literal') {
      display += slot.char
    } else if (slotChar) {
      display += slotChar.length > 1 ? slotChar[index] || '_' : slotChar
    } else {
      break
    }
  }
  return display
}

export function isComplete(masked: string, slots: MaskSlot[]) {
  return slots.every(
    (slot, index) =>
      slot.type === 'literal' ||
      slot.optional ||
      (index < masked.length && matches(slot.pattern!, masked[index])),
  )
}

export function nextToken(slots: MaskSlot[], from: number) {
  for (let index = from; index < slots.length; index++) {
    if (slots[index].type === 'token') {
      return index
    }
  }
  return slots.length
}

export function previousToken(slots: MaskSlot[], from: number) {
  for (let index = from; index >= 0; index--) {
    if (slots[index].type === 'token') {
      return index
    }
  }
  return -1
}
