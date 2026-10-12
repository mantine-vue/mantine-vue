export const PATH_SEPARATOR = '\0'
export const serializePath = (segments: string[]) => segments.join(PATH_SEPARATOR)
export interface JsonViewerArrayChunk {
  start: number
  end: number
}
export function getArrayChunks(length: number, groupArraysAfterLength: number | false) {
  if (groupArraysAfterLength === false) return null
  const size = Math.floor(groupArraysAfterLength)
  if (!(size >= 1) || length <= groupArraysAfterLength) return null
  const chunks: JsonViewerArrayChunk[] = []
  for (let start = 0; start < length; start += size)
    chunks.push({ start, end: Math.min(start + size, length) - 1 })
  return chunks
}
export const getChunkSegment = (chunk: JsonViewerArrayChunk) => `[${chunk.start}...${chunk.end}]`
export function resolveDisplayValue(value: any) {
  if (value !== null && typeof value === 'object' && typeof value.toJSON === 'function') {
    try {
      return value.toJSON()
    } catch {
      return value
    }
  }
  return value
}
export const isExpandableValue = (value: any): value is object =>
  value !== null && typeof value === 'object'
export const getEntries = (value: object): [string, any][] =>
  Array.isArray(value) ? value.map((item, index) => [String(index), item]) : Object.entries(value)
export function getExpandablePaths(
  value: any,
  {
    depth = Infinity,
    groupArraysAfterLength = false,
  }: { depth?: number; groupArraysAfterLength?: number | false } = {},
) {
  const paths: string[] = []
  const ancestors = new WeakSet<object>()
  const visit = (node: any, path: string[], level: number) => {
    const resolved = resolveDisplayValue(node)
    if (!isExpandableValue(resolved) || ancestors.has(resolved) || level > depth) return
    const entries = getEntries(resolved)
    if (!entries.length) return
    if (path.length) paths.push(serializePath(path))
    ancestors.add(resolved)
    const chunks = Array.isArray(resolved)
      ? getArrayChunks(entries.length, groupArraysAfterLength)
      : null
    if (chunks && level + 1 <= depth) {
      for (const chunk of chunks) {
        paths.push(serializePath([...path, getChunkSegment(chunk)]))
        entries
          .slice(chunk.start, chunk.end + 1)
          .forEach(([key, child]) => visit(child, [...path, key], level + 2))
      }
    } else entries.forEach(([key, child]) => visit(child, [...path, key], level + 1))
    ancestors.delete(resolved)
  }
  visit(value, [], 1)
  return paths
}
export function getValueType(value: any) {
  return value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
}
export function getTypeLabel(value: any) {
  const type = getValueType(value)
  return type === 'number'
    ? Number.isInteger(value)
      ? 'int'
      : 'float'
    : type === 'boolean'
      ? 'bool'
      : type
}
export function formatValue(
  value: any,
  withQuotes: boolean,
  collapseStringsAfterLength: number | false,
) {
  if (value === null) return { display: 'null', collapsed: false }
  if (value === undefined) return { display: 'undefined', collapsed: false }
  if (typeof value !== 'string') return { display: String(value), collapsed: false }
  if (collapseStringsAfterLength !== false && value.length > collapseStringsAfterLength) {
    const splitsPair = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(
      value.slice(collapseStringsAfterLength - 1),
    )
    const truncated = value.slice(0, collapseStringsAfterLength - (splitsPair ? 1 : 0))
    return {
      display: withQuotes ? `${JSON.stringify(truncated).slice(0, -1)}..."` : `${truncated}...`,
      collapsed: true,
    }
  }
  return { display: withQuotes ? JSON.stringify(value) : value, collapsed: false }
}
export function safeStringify(value: any) {
  const ancestors: object[] = []
  try {
    return (
      JSON.stringify(
        value,
        function (_key, item) {
          if (typeof item === 'bigint') return item.toString()
          if (typeof item !== 'object' || item === null) return item
          while (ancestors.length && ancestors.at(-1) !== this) ancestors.pop()
          if (ancestors.includes(item)) return '[Circular]'
          ancestors.push(item)
          return item
        },
        2,
      ) ?? String(value)
    )
  } catch {
    return String(value)
  }
}
