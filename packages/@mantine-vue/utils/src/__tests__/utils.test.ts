import { describe, expect, it } from 'vitest'
import {
  camelToKebabCase,
  deepMerge,
  filterProps,
  getBreakpointValue,
  getSortedBreakpoints,
  rem,
} from '../index'

describe('@mantine-vue/utils', () => {
  it('deep merges plain objects without mutating inputs', () => {
    const target = { a: 1, nested: { a: 1, b: 2 } }
    const source = { nested: { b: 3, c: 4 } }

    expect(deepMerge(target, source)).toEqual({ a: 1, nested: { a: 1, b: 3, c: 4 } })
    expect(target.nested.b).toBe(2)
  })

  it('converts Mantine unit helpers', () => {
    expect(rem(16)).toBe('1rem')
    expect(rem('32px')).toBe('2rem')
    expect(getBreakpointValue('48em')).toBe(768)
  })

  it('filters undefined props and converts class names', () => {
    expect(filterProps({ a: 1, b: undefined })).toEqual({ a: 1 })
    expect(camelToKebabCase('dataMantineColorScheme')).toBe('data-mantine-color-scheme')
  })

  it('sorts breakpoints by pixel value', () => {
    expect(getSortedBreakpoints({ md: '62em', xs: '36em' }).map((item) => item.breakpoint)).toEqual(
      ['xs', 'md'],
    )
  })
})
