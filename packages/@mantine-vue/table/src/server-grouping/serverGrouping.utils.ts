import {
  MVT_SERVER_GROUPING_ROOT_PATH_ID,
  type MVT_ServerGroupPathId,
} from './serverGrouping.types'

/**
 * Escape a path segment part so group ids may safely contain the reserved
 * characters `/` and `:` (and `%`, used for escaping).
 */
export const escapeServerGroupPathPart = (part: string): string =>
  part.replace(/%/g, '%25').replace(/:/g, '%3A').replace(/\//g, '%2F')

export const unescapeServerGroupPathPart = (part: string): string =>
  part.replace(/%2F/g, '/').replace(/%3A/g, ':').replace(/%25/g, '%')

/**
 * Build the stable path id of a group's content, e.g.
 * `createServerGroupPathId('__root__', 'country', 'BH')` → `'country:BH'` and
 * `createServerGroupPathId('country:BH', 'salesperson', '42')` →
 * `'country:BH/salesperson:42'`. Never derived from row indexes.
 */
export const createServerGroupPathId = (
  parentPathId: MVT_ServerGroupPathId,
  field: string,
  groupId: string,
): MVT_ServerGroupPathId => {
  const segment = `${escapeServerGroupPathPart(field)}:${escapeServerGroupPathPart(groupId)}`
  return parentPathId === MVT_SERVER_GROUPING_ROOT_PATH_ID ? segment : `${parentPathId}/${segment}`
}

export interface MVT_ServerGroupPathSegment {
  field: string
  groupId: string
}

/** Parse a path id back into its `{ field, groupId }` segments. Root → `[]`. */
export const parseServerGroupPathId = (
  pathId: MVT_ServerGroupPathId,
): MVT_ServerGroupPathSegment[] => {
  if (pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID) return []
  return pathId.split('/').map((segment) => {
    const separatorIndex = segment.indexOf(':')
    return {
      field: unescapeServerGroupPathPart(segment.slice(0, separatorIndex)),
      groupId: unescapeServerGroupPathPart(segment.slice(separatorIndex + 1)),
    }
  })
}

/** Depth of the content addressed by a path id (root → 0). */
export const getServerGroupPathDepth = (pathId: MVT_ServerGroupPathId): number =>
  pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID ? 0 : pathId.split('/').length

/** Whether `pathId` equals `ancestorPathId` or is nested anywhere below it. */
export const isServerGroupPathOrDescendant = (
  pathId: MVT_ServerGroupPathId,
  ancestorPathId: MVT_ServerGroupPathId,
): boolean =>
  ancestorPathId === MVT_SERVER_GROUPING_ROOT_PATH_ID ||
  pathId === ancestorPathId ||
  pathId.startsWith(`${ancestorPathId}/`)

/** JSON replacer producing deterministic output for plain objects. */
const stableReplacer = (_key: string, value: unknown): unknown => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = (value as Record<string, unknown>)[key]
        return acc
      }, {})
  }
  return value
}

/**
 * Serialize cache key parts deterministically (object key order does not
 * affect the result).
 */
export const serializeServerGroupingCacheKey = (parts: unknown[]): string =>
  JSON.stringify(parts, stableReplacer)

/** Whether an error was caused by request cancellation (never shown as an error). */
export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException
    ? error.name === 'AbortError'
    : (error as { name?: string } | null | undefined)?.name === 'AbortError'
