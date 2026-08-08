import { keys, px, rem } from '../../core'

export type SimpleGridStyleProp<T> = T | Partial<Record<string, T>>

/** Props shared by both `SimpleGrid` variables components. */
export interface SimpleGridVariablesProps {
  /** CSS selector the generated variables are scoped to. */
  selector: string

  /** Number of columns. Ignored when `minColWidth` is set. */
  cols?: SimpleGridStyleProp<number>

  /** Horizontal spacing, and vertical spacing when `verticalSpacing` is not set. */
  spacing?: SimpleGridStyleProp<string | number>

  /** Vertical spacing. Falls back to `spacing`. */
  verticalSpacing?: SimpleGridStyleProp<string | number>

  /** Minimum column width. Switches the grid to an auto-fit layout. */
  minColWidth?: string | number

  /** `grid-auto-rows` value. */
  autoRows?: string
}

/** A responsive value is an object keyed by breakpoint; anything else is a base value. */
export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function getMinColWidthValue(value: string | number | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? rem(value) : value
}

/** `base` is not a breakpoint – it is the value used below the smallest query. */
export function getBreakpoints(values: unknown) {
  return isObject(values) ? keys(values).filter((breakpoint) => breakpoint !== 'base') : []
}

export function sortBreakpoints(breakpoints: string[]) {
  return breakpoints.sort((a, b) => px(a) - px(b))
}
