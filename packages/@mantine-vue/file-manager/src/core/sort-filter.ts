import type { FileEntry, FileFilters, FileSort, FileTimestamp } from '../types'
import { getFileCategory } from './file-types'
import { getFileExtension } from './paths'

function toTime(value: FileTimestamp | undefined) {
  if (value === undefined) {
    return Number.NaN
  }

  return new Date(value).getTime()
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/** Natural order, so `file2` sorts before `file10`. */
export function compareNames(first: string, second: string) {
  return collator.compare(first, second)
}

function compareValues(first: number, second: number) {
  const firstMissing = Number.isNaN(first)
  const secondMissing = Number.isNaN(second)

  if (firstMissing || secondMissing) {
    return Number(firstMissing) - Number(secondMissing)
  }

  return first - second
}

function getComparator(field: FileSort['field']) {
  switch (field) {
    case 'size':
      return (first: FileEntry, second: FileEntry) =>
        compareValues(first.size ?? Number.NaN, second.size ?? Number.NaN)
    case 'modifiedAt':
      return (first: FileEntry, second: FileEntry) =>
        compareValues(toTime(first.modifiedAt), toTime(second.modifiedAt))
    case 'type':
      return (first: FileEntry, second: FileEntry) =>
        compareNames(getFileExtension(first.name), getFileExtension(second.name))
    default:
      return (first: FileEntry, second: FileEntry) => compareNames(first.name, second.name)
  }
}

/** Returns a sorted copy. Ties fall back to the name, so the order is stable across reloads. */
export function sortEntries(entries: FileEntry[], sort: FileSort, foldersFirst = true) {
  const compare = getComparator(sort.field)
  const direction = sort.direction === 'asc' ? 1 : -1

  return [...entries].sort((first, second) => {
    if (foldersFirst && first.kind !== second.kind) {
      return first.kind === 'folder' ? -1 : 1
    }

    return direction * compare(first, second) || compareNames(first.name, second.name)
  })
}

export function matchesFilters(entry: FileEntry, filters: FileFilters) {
  if (filters.categories?.length && !filters.categories.includes(getFileCategory(entry))) {
    return false
  }

  if (filters.starredOnly && !entry.starred) {
    return false
  }

  // A size or date range describes files, so folders stay reachable while it is active.
  if (entry.kind === 'file') {
    const size = entry.size ?? 0

    if (filters.minSize !== undefined && size < filters.minSize) {
      return false
    }

    if (filters.maxSize !== undefined && size > filters.maxSize) {
      return false
    }

    const modified = toTime(entry.modifiedAt)

    if (filters.modifiedAfter !== undefined && !(modified >= toTime(filters.modifiedAfter))) {
      return false
    }

    if (filters.modifiedBefore !== undefined && !(modified <= toTime(filters.modifiedBefore))) {
      return false
    }
  }

  return true
}

export function matchesQuery(entry: FileEntry, query: string) {
  return entry.name.toLowerCase().includes(query.trim().toLowerCase())
}

/** Number of filter groups in use, shown as a badge on the filter control. */
export function countActiveFilters(filters: FileFilters) {
  return [
    filters.categories?.length,
    filters.minSize !== undefined || filters.maxSize !== undefined,
    filters.modifiedAfter !== undefined || filters.modifiedBefore !== undefined,
    filters.starredOnly,
  ].filter(Boolean).length
}
