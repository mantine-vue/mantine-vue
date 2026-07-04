export type Primitive = string | number | boolean | bigint | symbol | null | undefined

export function keys<T extends Record<string, any>>(object: T) {
  return Object.keys(object) as (keyof T & string)[]
}

export function noop() {}

export function isPrimitive(value: unknown): value is Primitive {
  return value === null || (typeof value !== 'object' && typeof value !== 'function')
}

function isPlainObject(value: unknown): value is Record<string, any> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U,
): T & U {
  const result: Record<string, any> = { ...target }

  keys(source).forEach((key) => {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(targetValue, sourceValue)
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  })

  return result as T & U
}

export function camelToKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

export function filterProps<T extends Record<string, any>>(props: T) {
  return keys(props).reduce<Partial<T>>((acc, key) => {
    if (props[key] !== undefined) {
      acc[key] = props[key]
    }

    return acc
  }, {})
}

export function isNumberLike(value: unknown) {
  if (typeof value === 'number') {
    return true
  }

  if (typeof value === 'string') {
    if (
      value.startsWith('calc(') ||
      value.startsWith('var(') ||
      (value.includes(' ') && value.trim() !== '')
    ) {
      return true
    }

    const cssUnitsRegex =
      /^[+-]?[0-9]+(\.[0-9]+)?(px|em|rem|ex|ch|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cm|mm|in|pt|pc|q|cqw|cqh|cqi|cqb|cqmin|cqmax|%)?$/
    const values = value.trim().split(/\s+/)
    return values.every((val) => cssUnitsRegex.test(val))
  }

  return false
}

export function rem(value: unknown) {
  if (typeof value === 'number') {
    return `${value / 16}rem`
  }

  if (typeof value === 'string') {
    if (value.includes('calc(') || value.includes('var(')) {
      return value
    }

    if (value.endsWith('px')) {
      return `${Number(value.replace('px', '')) / 16}rem`
    }

    return value
  }

  return value as string
}

export function em(value: unknown) {
  if (typeof value === 'number') {
    return `${value / 16}em`
  }

  if (typeof value === 'string' && value.endsWith('px')) {
    return `${Number(value.replace('px', '')) / 16}em`
  }

  return value as string
}

export function px(value: unknown) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    if (value.endsWith('rem') || value.endsWith('em')) {
      return Number(value.replace('rem', '').replace('em', '')) * 16
    }

    if (value.endsWith('px')) {
      return Number(value.replace('px', ''))
    }
  }

  return Number(value) || 0
}

export function getSize(size: unknown, prefix = 'size', convertToRem = true): string | undefined {
  if (size === undefined) {
    return undefined
  }

  return isNumberLike(size) ? (convertToRem ? rem(size) : String(size)) : `var(--${prefix}-${size})`
}

export const getSpacing = (size: unknown) => getSize(size, 'mantine-spacing')
export const getRadius = (size: unknown) =>
  size === undefined ? 'var(--mantine-radius-default)' : getSize(size, 'mantine-radius')
export const getShadow = (size: unknown) =>
  size ? getSize(size, 'mantine-shadow', false) : undefined
export const getFontSize = (size: unknown) => getSize(size, 'mantine-font-size')
export const getLineHeight = (size: unknown) => getSize(size, 'mantine-line-height', false)

export function getBreakpointValue(value: string | number) {
  if (typeof value === 'number') {
    return value
  }

  if (value.endsWith('px')) {
    return Number(value.replace('px', ''))
  }

  if (value.endsWith('em') || value.endsWith('rem')) {
    return Number(value.replace('em', '').replace('rem', '')) * 16
  }

  return Number(value)
}

export function getSortedBreakpoints<T extends Record<string, string>>(breakpoints: T) {
  return keys(breakpoints)
    .map((breakpoint) => ({ breakpoint, px: getBreakpointValue(breakpoints[breakpoint]) }))
    .sort((a, b) => a.px - b.px)
}

export function getBaseValue<T>(value: T | Record<string, T>): T | undefined {
  if (isPlainObject(value)) {
    return (value as Record<string, T>).base
  }

  return value
}

export function getDefaultZIndex(level: 'app' | 'modal' | 'popover' | 'overlay' | 'max') {
  const values = {
    app: 100,
    modal: 200,
    popover: 300,
    overlay: 400,
    max: 9999,
  }

  return values[level]
}

export function memoize<Args extends unknown[], Return>(fn: (...args: Args) => Return) {
  const cache = new Map<string, Return>()

  return (...args: Args) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

export function findClosestNumber(value: number, values: number[]) {
  return values.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value) ? current : closest,
  )
}

export function createEventHandler<Event>(...handlers: (((event: Event) => void) | undefined)[]) {
  return (event: Event) => {
    handlers.forEach((handler) => handler?.(event))
  }
}

export function getSafeId(uid: string, errorMessage: string) {
  return (staticId?: string) => {
    if (typeof staticId === 'string') {
      return staticId
    }

    if (uid === '') {
      throw new Error(errorMessage)
    }

    return uid
  }
}
