import { describe, expect, it } from 'vitest'
import { hasPermission, resolveCapabilities } from '../core/capabilities'
import { FileManagerError, toFileErrorInfo } from '../core/errors'
import { getFileCategory, isFileTypeAccepted, isSafePreviewUrl } from '../core/file-types'
import { formatFileSize } from '../core/format'
import {
  getAvailableName,
  getFileNameIssue,
  sanitizeRelativePath,
  splitFileName,
} from '../core/paths'
import { countActiveFilters, matchesFilters, sortEntries } from '../core/sort-filter'
import { mergeFileManagerLabels } from '../labels'
import type { FileEntry, FileSystemAdapter } from '../types'
import { UNSAFE_URL } from './test-utils'

const entry = (overrides: Partial<FileEntry>): FileEntry => ({
  id: overrides.name ?? 'id',
  name: 'file.txt',
  kind: 'file',
  parentId: 'root',
  ...overrides,
})

describe('file names', () => {
  it.each([
    ['', 'empty'],
    ['   ', 'empty'],
    ['a/b', 'forbidden-character'],
    ['a\\b', 'forbidden-character'],
    ['..', 'forbidden-character'],
    ['name.', 'forbidden-character'],
    ['name ', 'forbidden-character'],
    ['a\u0000b', 'forbidden-character'],
    ['CON', 'reserved'],
    ['lpt1.txt', 'reserved'],
    ['x'.repeat(256), 'too-long'],
  ])('rejects %j', (name, issue) => {
    expect(getFileNameIssue(name)).toBe(issue)
  })

  it('accepts ordinary names', () => {
    expect(getFileNameIssue('Quarterly report (final).v2.pdf')).toBeNull()
    expect(getFileNameIssue('.gitignore')).toBeNull()
    expect(getFileNameIssue('مستند.txt')).toBeNull()
  })

  it('never lets a relative path climb out of its destination', () => {
    expect(sanitizeRelativePath('../../etc/passwd')).toBe('etc/passwd')
    expect(sanitizeRelativePath('/absolute/file.txt')).toBe('absolute/file.txt')
    expect(sanitizeRelativePath('a\\..\\b.txt')).toBe('a/b.txt')
    expect(sanitizeRelativePath('./a/./b.txt')).toBe('a/b.txt')
    expect(sanitizeRelativePath('a/ba:d.txt')).toBeNull()
    expect(sanitizeRelativePath('../..')).toBeNull()
  })

  it('splits extensions and leaves dotfiles alone', () => {
    expect(splitFileName('archive.tar.gz')).toEqual({ base: 'archive.tar', extension: '.gz' })
    expect(splitFileName('.env')).toEqual({ base: '.env', extension: '' })
  })

  it('finds the first free name', () => {
    const taken = new Set(['a.txt', 'a (2).txt'])

    expect(getAvailableName('a.txt', (name) => taken.has(name))).toBe('a (3).txt')
    expect(getAvailableName('b.txt', (name) => taken.has(name))).toBe('b.txt')
  })
})

describe('file types', () => {
  it('prefers the extension over a generic mime type', () => {
    expect(getFileCategory({ kind: 'file', name: 'a.ts', mimeType: 'text/plain' })).toBe('code')
    expect(getFileCategory({ kind: 'file', name: 'a', mimeType: 'image/png' })).toBe('image')
    expect(getFileCategory({ kind: 'file', name: 'a.unknown' })).toBe('other')
    expect(getFileCategory({ kind: 'folder', name: 'a.png' })).toBe('folder')
  })

  it('matches accept tokens', () => {
    const png = { name: 'a.PNG', type: 'image/png' }

    expect(isFileTypeAccepted(png, undefined)).toBe(true)
    expect(isFileTypeAccepted(png, ['image/*'])).toBe(true)
    expect(isFileTypeAccepted(png, ['.png'])).toBe(true)
    expect(isFileTypeAccepted(png, ['image/png'])).toBe(true)
    expect(isFileTypeAccepted(png, ['application/pdf', '.pdf'])).toBe(false)
  })

  it('only lets safe protocols reach the preview', () => {
    expect(isSafePreviewUrl('https://cdn.test/a.png')).toBe(true)
    expect(isSafePreviewUrl('/files/a.png')).toBe(true)
    expect(isSafePreviewUrl('blob:http://localhost/1')).toBe(true)
    expect(isSafePreviewUrl(UNSAFE_URL)).toBe(false)
    expect(isSafePreviewUrl('data:text/html,<script>1</script>')).toBe(false)
  })
})

describe('sorting and filtering', () => {
  const folder = entry({ name: 'zeta', kind: 'folder' })
  const small = entry({ name: 'file2.txt', size: 10, modifiedAt: '2026-01-01' })
  const large = entry({ name: 'file10.pdf', size: 900, modifiedAt: '2026-03-01' })
  const names = (entries: FileEntry[]) => entries.map((item) => item.name)

  it('sorts names naturally with folders first', () => {
    expect(names(sortEntries([large, small, folder], { field: 'name', direction: 'asc' }))).toEqual(
      ['zeta', 'file2.txt', 'file10.pdf'],
    )
  })

  it('keeps folders first in both directions', () => {
    expect(
      names(sortEntries([small, folder, large], { field: 'size', direction: 'desc' })),
    ).toEqual(['zeta', 'file10.pdf', 'file2.txt'])
  })

  it('can mix folders with files', () => {
    expect(names(sortEntries([small, folder], { field: 'name', direction: 'asc' }, false))).toEqual(
      ['file2.txt', 'zeta'],
    )
  })

  it('sorts by type and date', () => {
    expect(names(sortEntries([small, large], { field: 'type', direction: 'asc' }))).toEqual([
      'file10.pdf',
      'file2.txt',
    ])
    expect(names(sortEntries([small, large], { field: 'modifiedAt', direction: 'desc' }))).toEqual([
      'file10.pdf',
      'file2.txt',
    ])
  })

  it('filters by category, size and date', () => {
    expect(matchesFilters(large, { categories: ['pdf'] })).toBe(true)
    expect(matchesFilters(small, { categories: ['pdf'] })).toBe(false)
    expect(matchesFilters(small, { minSize: 100 })).toBe(false)
    expect(matchesFilters(large, { maxSize: 100 })).toBe(false)
    expect(matchesFilters(small, { modifiedAfter: '2026-02-01' })).toBe(false)
    expect(matchesFilters(large, { modifiedBefore: '2026-02-01' })).toBe(false)
  })

  it('keeps folders reachable while a size range is active', () => {
    expect(matchesFilters(folder, { minSize: 100 })).toBe(true)
  })

  it('counts filter groups', () => {
    expect(countActiveFilters({})).toBe(0)
    expect(countActiveFilters({ categories: ['pdf'], minSize: 1, maxSize: 2 })).toBe(2)
  })
})

describe('capabilities', () => {
  const list: FileSystemAdapter['list'] = async () => {
    throw new Error('unused')
  }

  it('derives features from the methods of the adapter', () => {
    const capabilities = resolveCapabilities({ list, rename: async () => entry({}) })

    expect(capabilities.rename).toBe(true)
    expect(capabilities.upload).toBe(false)
    expect(capabilities.trash).toBe(false)
  })

  it('needs both halves of a feature', () => {
    expect(
      resolveCapabilities({ list, trash: async () => ({ succeeded: [], failed: [] }) }).trash,
    ).toBe(false)
  })

  it('lets an adapter turn a feature off, but never on without its method', () => {
    expect(
      resolveCapabilities({
        list,
        rename: async () => entry({}),
        capabilities: { rename: false, move: true },
      }),
    ).toMatchObject({ rename: false, move: false })
  })

  it('treats missing permissions as allowed', () => {
    expect(hasPermission({}, 'delete')).toBe(true)
    expect(hasPermission({ permissions: { delete: false } }, 'delete')).toBe(false)
  })
})

describe('errors and labels', () => {
  it('normalizes unknown errors', () => {
    expect(toFileErrorInfo(new FileManagerError('conflict', 'Taken'))).toMatchObject({
      code: 'conflict',
      message: 'Taken',
    })
    expect(toFileErrorInfo(new TypeError('Failed to fetch')).code).toBe('network')
    expect(toFileErrorInfo('nope')).toEqual({ code: 'unknown', message: 'nope' })
  })

  it('merges nested label groups', () => {
    const labels = mergeFileManagerLabels({ errors: { conflict: 'Taken' } as any })

    expect(labels.errors.conflict).toBe('Taken')
    expect(labels.errors['not-found']).toBe('The item no longer exists')
  })

  it('formats sizes', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(undefined)).toBe('')
  })
})
