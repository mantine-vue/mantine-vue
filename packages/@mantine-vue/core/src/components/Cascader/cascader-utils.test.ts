import { describe, expect, it } from 'vitest'
import { flattenCascaderPaths, getCascaderColumns, getCascaderPathOptions } from './cascader-utils'

const data = [
  {
    value: 'a',
    label: 'A',
    children: [
      { value: 'b', label: 'B', children: [{ value: 'c', label: 'C' }] },
      { value: 'disabled', disabled: true },
    ],
  },
]

describe('Cascader utilities', () => {
  it('resolves columns and selected options', () => {
    expect(getCascaderColumns(data, ['a', 'b', 'c'])).toEqual([
      data,
      data[0].children,
      data[0].children![0].children,
    ])
    expect(getCascaderPathOptions(data, ['a', 'b', 'c']).map((item) => item.value)).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('flattens every selectable path and propagates disabled state', () => {
    expect(flattenCascaderPaths(data)).toMatchObject([
      { path: ['a'], leaf: false, disabled: false },
      { path: ['a', 'b'], leaf: false, disabled: false },
      { path: ['a', 'b', 'c'], leaf: true, disabled: false },
      { path: ['a', 'disabled'], leaf: true, disabled: true },
    ])
  })
})
