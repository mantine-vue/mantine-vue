import { describe, expect, it } from 'vitest'
import { formatValue, getArrayChunks, safeStringify } from './json-viewer-utils'

describe('@mantine-vue/code-highlight JsonViewer utilities', () => {
  it('groups large arrays into stable inclusive ranges', () => {
    expect(getArrayChunks(7, 3)).toEqual([
      { start: 0, end: 2 },
      { start: 3, end: 5 },
      { start: 6, end: 6 },
    ])
    expect(getArrayChunks(3, 3)).toBeNull()
    expect(getArrayChunks(10, false)).toBeNull()
  })

  it('does not split a surrogate pair when collapsing strings', () => {
    expect(formatValue('a😀bc', true, 3)).toEqual({ display: '"a😀..."', collapsed: true })
  })

  it('stringifies bigint and circular references safely', () => {
    const value: Record<string, unknown> = { count: 1n }
    value.self = value

    expect(safeStringify(value)).toContain('"count": "1"')
    expect(safeStringify(value)).toContain('"self": "[Circular]"')
  })
})
