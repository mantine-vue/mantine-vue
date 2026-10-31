import { describe, expect, it, vi } from 'vitest'
import { effectScope, shallowRef } from 'vue'
import { useFileManager, type UseFileManagerOptions } from '../composables/use-file-manager'
import { FileManagerError } from '../core/errors'
import type { FileEntry, FileUploadItem } from '../types'
import { createAdapter, flush, UNSAFE_URL } from './test-utils'

async function setup(
  options: Partial<UseFileManagerOptions> & { adapter?: ReturnType<typeof createAdapter> } = {},
) {
  const adapter = options.adapter ?? createAdapter()
  const onNotice = vi.fn()
  const manager = useFileManager({ cache: false, onNotice, ...options, adapter })

  await manager.load()

  return { manager, adapter, onNotice }
}

const names = (manager: ReturnType<typeof useFileManager>) =>
  manager.visibleEntries.value.map((entry) => entry.name)

const entry = (manager: ReturnType<typeof useFileManager>, id: string) =>
  manager.visibleEntries.value.find((item) => item.id === id) as FileEntry

describe('navigation', () => {
  it('loads the root and keeps a history', async () => {
    const { manager } = await setup()

    expect(names(manager)).toEqual(['Documents', 'Photos', 'locked.txt', 'readme.md'])
    expect(manager.canGoBack.value).toBe(false)
    expect(manager.canGoUp.value).toBe(false)

    await manager.openFolder('docs')
    await flush()

    expect(manager.folder.value?.name).toBe('Documents')
    expect(manager.canGoUp.value).toBe(true)

    manager.goBack()
    await flush()

    expect(manager.folder.value?.name).toBe('Home')
    expect(manager.canGoForward.value).toBe(true)

    manager.goForward()
    await flush()

    expect(manager.folder.value?.name).toBe('Documents')

    manager.goUp()
    await flush()

    expect(manager.folder.value?.name).toBe('Home')
    expect(manager.canGoForward.value).toBe(false)
  })

  it('reports a location that fails to load', async () => {
    const { manager } = await setup()

    await manager.openFolder('missing')
    await flush()

    expect(manager.error.value?.code).toBe('not-found')
    expect(manager.items.value).toEqual([])
  })

  it('ignores a slower response of an older location', async () => {
    const adapter = createAdapter({
      onRequest: async (_, request: any) => {
        if (request.folderId === 'photos') {
          await new Promise((resolve) => setTimeout(resolve, 30))
        }
      },
    })
    const { manager } = await setup({ adapter })

    void manager.openFolder('photos')
    void manager.openFolder('docs')
    await new Promise((resolve) => setTimeout(resolve, 60))
    await flush()

    expect(manager.folder.value?.name).toBe('Documents')
  })

  it('serves fresh listings from the cache', async () => {
    const onRequest = vi.fn()
    const adapter = createAdapter({ onRequest })
    const { manager } = await setup({ adapter, cache: { ttl: 1000 } })

    await manager.openFolder('docs')
    await flush()
    manager.goBack()
    await flush()

    expect(onRequest.mock.calls.filter(([operation]) => operation === 'list')).toHaveLength(2)

    await manager.refresh()

    expect(
      onRequest.mock.calls.filter(([operation]) => operation === 'list').length,
    ).toBeGreaterThan(2)
  })

  it('walks every page when pagination is off', async () => {
    const adapter = createAdapter()
    const list = adapter.list.bind(adapter)

    adapter.list = (request) => list({ ...request, limit: 2 })

    const { manager } = await setup({ adapter })

    expect(manager.items.value).toHaveLength(4)
  })

  it('appends pages with infinite pagination', async () => {
    const { manager } = await setup({ pagination: 'infinite', pageSize: 3 })

    expect(manager.items.value).toHaveLength(3)
    expect(manager.hasMore.value).toBe(true)

    await manager.loadMore()

    expect(manager.items.value).toHaveLength(4)
    expect(manager.hasMore.value).toBe(false)
  })

  it('slices pages and loads what a later page needs', async () => {
    const { manager } = await setup({ pagination: 'pages', pageSize: 3 })

    expect(manager.pageCount.value).toBe(2)
    expect(manager.pageEntries.value).toHaveLength(3)

    await manager.setPage(2)

    expect(manager.items.value).toHaveLength(4)
    expect(manager.pageEntries.value).toHaveLength(1)
  })

  it('opens virtual locations', async () => {
    const { manager, adapter } = await setup()

    await adapter.setStarred!({ ids: ['readme'], starred: true })
    await manager.navigate({ type: 'favorites' })
    await flush()

    expect(names(manager)).toEqual(['readme.md'])
    expect(manager.canWriteHere.value).toBe(false)

    await manager.navigate({ type: 'recent' })
    await flush()

    expect(names(manager)).toContain('notes.txt')
  })

  it('previews files and steps through them', async () => {
    const { manager } = await setup()

    manager.open(entry(manager, 'readme'))

    expect(manager.previewEntry.value?.id).toBe('readme')

    manager.stepPreview(-1)

    expect(manager.previewEntry.value?.id).toBe('locked')

    manager.stepPreview(1)
    manager.stepPreview(1)

    expect(manager.previewEntry.value?.id).toBe('locked')
  })

  it('lets the application take over opening a file', async () => {
    const onOpenFile = vi.fn(() => false)
    const { manager } = await setup({ onOpenFile })

    manager.open(entry(manager, 'readme'))

    expect(onOpenFile).toHaveBeenCalled()
    expect(manager.previewEntry.value).toBeNull()
  })
})

describe('selection', () => {
  it('supports replace, toggle and range', async () => {
    const { manager } = await setup()

    manager.select('docs')
    expect([...manager.selection.value]).toEqual(['docs'])

    manager.select('readme', 'toggle')
    expect(manager.selectedEntries.value).toHaveLength(2)

    manager.select('docs')
    manager.select('readme', 'range')
    expect(manager.selectedEntries.value.map((item) => item.id)).toEqual([
      'docs',
      'photos',
      'locked',
      'readme',
    ])

    manager.select('docs', 'toggle')
    expect(manager.isSelected('docs')).toBe(false)
  })

  it('selects everything visible and clears on navigation', async () => {
    const { manager } = await setup()

    manager.selectAll()
    expect(manager.selection.value.size).toBe(4)

    await manager.openFolder('docs')

    expect(manager.selection.value.size).toBe(0)
  })

  it('does not act on selected entries a filter hides, and restores them after', async () => {
    const { manager } = await setup()

    manager.selectAll()
    manager.setFilters({ categories: ['text'] })

    expect(manager.selectedEntries.value.map((item) => item.name)).toEqual([
      'locked.txt',
      'readme.md',
    ])

    manager.clearFilters()

    expect(manager.selectedEntries.value).toHaveLength(4)
  })

  it('survives a change of layout', async () => {
    const { manager } = await setup({ initialFilters: { categories: ['text', 'folder'] } })

    manager.select('docs')
    manager.setSort({ field: 'size', direction: 'desc' })
    manager.view.value = 'grid'
    manager.view.value = 'tree'
    manager.view.value = 'gallery'

    expect(manager.isSelected('docs')).toBe(true)
    expect(manager.sort.value.field).toBe('size')
    expect(manager.filters.value.categories).toEqual(['text', 'folder'])
  })
})

describe('search, sort and filter', () => {
  it('searches through the adapter and cancels older queries', async () => {
    const { manager } = await setup()

    void manager.setSearchQuery('r')
    await manager.setSearchQuery('old')
    await flush()

    expect(names(manager)).toEqual(['old.txt'])

    await manager.setSearchQuery('')

    expect(names(manager)).toHaveLength(4)
  })

  it('falls back to the loaded entries without search support', async () => {
    const adapter = createAdapter({ capabilities: { search: false } })
    const { manager } = await setup({ adapter })

    await manager.setSearchQuery('READ')

    expect(names(manager)).toEqual(['readme.md'])
  })

  it('toggles the sort direction', async () => {
    const { manager } = await setup()

    manager.toggleSort('name')
    expect(manager.sort.value.direction).toBe('desc')
    expect(names(manager)[0]).toBe('Photos')

    manager.toggleSort('size')
    expect(manager.sort.value).toEqual({ field: 'size', direction: 'asc' })
  })

  it('applies a custom predicate', async () => {
    const { manager } = await setup({ entryFilter: (item) => item.kind === 'folder' })

    expect(names(manager)).toEqual(['Documents', 'Photos'])
  })
})

describe('operations', () => {
  it('creates a folder, selects it and undoes it', async () => {
    const { manager } = await setup()

    await manager.createFolder('New')

    const created = manager.visibleEntries.value.find((item) => item.name === 'New')

    expect(created).toBeDefined()
    expect(manager.isSelected(created!.id)).toBe(true)

    await manager.undo()

    expect(names(manager)).not.toContain('New')

    await manager.redo()

    expect(names(manager)).toContain('New')
  })

  it('renames, undoes and redoes', async () => {
    const { manager } = await setup()

    await manager.rename(entry(manager, 'readme'), 'intro.md')
    expect(names(manager)).toContain('intro.md')

    await manager.undo()
    expect(names(manager)).toContain('readme.md')

    await manager.redo()
    expect(names(manager)).toContain('intro.md')
    expect(manager.canRedo.value).toBe(false)
  })

  it('moves, undoes across different origins and redoes', async () => {
    const { manager, adapter } = await setup()

    await manager.move([entry(manager, 'readme')], 'docs')

    expect(names(manager)).not.toContain('readme.md')
    expect(adapter.findByPath('/Documents/readme.md')).toBeDefined()

    await manager.undo()

    expect(adapter.findByPath('/readme.md')).toBeDefined()

    await manager.redo()

    expect(adapter.findByPath('/Documents/readme.md')).toBeDefined()
  })

  it('treats a move to the folder an entry is already in as a no-op', async () => {
    const { manager, onNotice } = await setup()

    expect(await manager.move([entry(manager, 'readme')], null)).toBeUndefined()
    expect(manager.canUndo.value).toBe(false)
    expect(onNotice).not.toHaveBeenCalled()
  })

  it('keeps the folder tree up to date, including at the root', async () => {
    const { manager } = await setup()

    await manager.loadFolderChildren(null)
    await manager.createFolder('New')

    expect(manager.getFolderChildren(null)?.map((item) => item.name)).toContain('New')

    await manager.remove([entry(manager, 'docs')], false)

    expect(manager.getFolderChildren(null)?.map((item) => item.name)).not.toContain('Documents')
  })

  it('reports partial failures and keeps the entries that went through', async () => {
    const { manager, onNotice } = await setup()

    await manager.move([entry(manager, 'readme'), entry(manager, 'locked')], 'docs')

    expect(names(manager)).toEqual(['Documents', 'Photos', 'locked.txt'])
    expect(onNotice).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'warning',
        title: expect.stringContaining('1 of 2 failed'),
        message: expect.stringContaining('locked.txt'),
      }),
    )
  })

  it('duplicates next to the source under a free name', async () => {
    const { manager } = await setup()

    await manager.duplicate([entry(manager, 'readme')])

    expect(names(manager)).toContain('readme (2).md')
    expect(manager.selectedEntries.value.map((item) => item.name)).toEqual(['readme (2).md'])

    await manager.undo()

    expect(names(manager)).not.toContain('readme (2).md')
  })

  it('cuts and pastes, then empties the clipboard', async () => {
    const { manager } = await setup()

    manager.cut([entry(manager, 'readme')])

    expect(manager.isCut('readme')).toBe(true)

    await manager.openFolder('docs')
    await flush()
    await manager.paste()

    expect(names(manager)).toContain('readme.md')
    expect(manager.clipboard.value).toBeNull()
  })

  it('copies and can paste repeatedly', async () => {
    const { manager } = await setup({ conflictStrategy: 'rename' })

    manager.copyToClipboard([entry(manager, 'readme')])
    await manager.paste()
    await manager.paste()

    expect(names(manager)).toEqual(
      expect.arrayContaining(['readme.md', 'readme (2).md', 'readme (3).md']),
    )
    expect(manager.clipboard.value).not.toBeNull()
  })

  it('refuses to cut entries that cannot move', async () => {
    const { manager } = await setup()

    manager.cut([entry(manager, 'locked')])

    expect(manager.clipboard.value).toBeNull()
  })

  it('trashes through a confirmation and undoes it', async () => {
    const { manager } = await setup()
    const confirm = vi.fn(async () => true)

    manager.setHandlers({ confirm })

    await manager.remove([entry(manager, 'readme')])

    expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ kind: 'trash' }))
    expect(names(manager)).not.toContain('readme.md')

    await manager.undo()

    expect(names(manager)).toContain('readme.md')
  })

  it('stops when the confirmation is declined', async () => {
    const { manager } = await setup()

    manager.setHandlers({ confirm: async () => false })

    await manager.remove([entry(manager, 'readme')])

    expect(names(manager)).toContain('readme.md')
  })

  it('skips confirmations that are turned off', async () => {
    const { manager } = await setup()
    const confirm = vi.fn(async () => true)

    manager.setHandlers({ confirm })
    manager.confirmOptions.value = { trash: false }

    await manager.remove([entry(manager, 'readme')])

    expect(confirm).not.toHaveBeenCalled()
  })

  it('deletes for good when the backend has no trash', async () => {
    const adapter = createAdapter({ capabilities: { trash: false } })
    const { manager } = await setup({ adapter })
    const confirm = vi.fn(async () => true)

    manager.setHandlers({ confirm })

    await manager.remove([entry(manager, 'readme')])

    expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ kind: 'delete' }))
    expect(adapter.findByPath('/readme.md')).toBeUndefined()
  })

  it('restores from the trash and empties it', async () => {
    const { manager } = await setup()

    await manager.remove([entry(manager, 'readme'), entry(manager, 'photos')])
    await manager.navigate({ type: 'trash' })
    await flush()

    expect(names(manager)).toEqual(['Photos', 'readme.md'])

    await manager.restore([entry(manager, 'readme')])

    expect(names(manager)).toEqual(['Photos'])

    await manager.emptyTrash()

    expect(names(manager)).toEqual([])
    expect(manager.canUndo.value).toBe(false)
  })

  it('forgets undo steps once a permanent delete makes them unsafe', async () => {
    const { manager } = await setup()

    await manager.rename(entry(manager, 'readme'), 'intro.md')
    await manager.deletePermanently([
      manager.visibleEntries.value.find((e) => e.name === 'intro.md')!,
    ])

    expect(manager.canUndo.value).toBe(false)
  })

  it('toggles favorites', async () => {
    const { manager } = await setup()

    await manager.setStarred([entry(manager, 'readme')], true)

    expect(entry(manager, 'readme').starred).toBe(true)
  })

  it('runs concurrent operations one after the other', async () => {
    const order: string[] = []
    const adapter = createAdapter({
      latency: 1,
      onRequest: (operation) => {
        order.push(operation)
      },
    })
    const { manager } = await setup({ adapter })

    order.length = 0

    await Promise.all([manager.createFolder('A'), manager.createFolder('B')])

    expect(order.filter((operation) => operation === 'createFolder')).toHaveLength(2)
    expect(order.indexOf('list')).toBeGreaterThan(order.indexOf('createFolder'))
    expect(order.lastIndexOf('createFolder')).toBeGreaterThan(order.indexOf('list'))
    expect(manager.pendingOperations.value).toBe(0)
  })

  it('turns a rejected operation into feedback', async () => {
    const adapter = createAdapter({
      onRequest: (operation) => {
        if (operation === 'createFolder') {
          throw new FileManagerError('quota-exceeded', 'Storage is full')
        }
      },
    })
    const { manager, onNotice } = await setup({ adapter })

    await manager.createFolder('New')

    expect(onNotice).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: 'Storage is full' }),
    )
    expect(manager.canUndo.value).toBe(false)
  })

  it('reports a step that can no longer be undone', async () => {
    const { manager, adapter, onNotice } = await setup()

    await manager.rename(entry(manager, 'readme'), 'intro.md')
    await adapter.delete!({ ids: ['readme'] })
    await manager.undo()

    expect(onNotice).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'error' }))
    expect(manager.canUndo.value).toBe(false)
  })
})

describe('name conflicts', () => {
  const files = () => [
    { id: 'a', name: 'report.pdf', size: 1 },
    { id: 'b', name: 'other.pdf', size: 1 },
    { id: 'c', name: 'third.pdf', size: 1 },
    {
      id: 'folder',
      name: 'folder',
      children: [
        { id: 'x', name: 'report.pdf', size: 2 },
        { id: 'y', name: 'other.pdf', size: 2 },
      ],
    },
  ]

  it('asks per item, and moves the rest right away', async () => {
    const { manager, adapter } = await setup({ adapter: createAdapter({ files: files() }) })
    const resolveConflict = vi.fn(async () => ({ strategy: 'skip' as const }))

    manager.setHandlers({ resolveConflict })

    await manager.move([entry(manager, 'a'), entry(manager, 'b'), entry(manager, 'c')], 'folder')

    expect(resolveConflict).toHaveBeenCalledTimes(2)
    expect(resolveConflict).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'report.pdf', destination: 'folder', remaining: 1 }),
    )
    expect(adapter.findByPath('/folder/third.pdf')).toBeDefined()
    expect(adapter.findByPath('/report.pdf')).toBeDefined()
  })

  it('applies a decision to the remaining conflicts', async () => {
    const { manager, adapter } = await setup({ adapter: createAdapter({ files: files() }) })
    const resolveConflict = vi.fn(async () => ({ strategy: 'rename' as const, applyToAll: true }))

    manager.setHandlers({ resolveConflict })

    await manager.copy([entry(manager, 'a'), entry(manager, 'b')], 'folder')

    expect(resolveConflict).toHaveBeenCalledTimes(1)
    expect(adapter.findByPath('/folder/report (2).pdf')).toBeDefined()
    expect(adapter.findByPath('/folder/other (2).pdf')).toBeDefined()
  })

  it('does not offer to undo an overwrite', async () => {
    const { manager } = await setup({ adapter: createAdapter({ files: files() }) })

    manager.setHandlers({ resolveConflict: async () => ({ strategy: 'overwrite' }) })

    await manager.move([entry(manager, 'a')], 'folder')

    expect(manager.canUndo.value).toBe(false)
  })

  it('uses a fixed strategy without asking', async () => {
    const { manager, adapter } = await setup({
      adapter: createAdapter({ files: files() }),
      conflictStrategy: 'rename',
    })
    const resolveConflict = vi.fn()

    manager.setHandlers({ resolveConflict })

    await manager.move([entry(manager, 'a')], 'folder')

    expect(resolveConflict).not.toHaveBeenCalled()
    expect(adapter.findByPath('/folder/report (2).pdf')).toBeDefined()
  })
})

describe('downloads', () => {
  it('saves one file and archives anything else', async () => {
    const saveFile = vi.fn()
    const { manager } = await setup({ saveFile })

    await manager.download([entry(manager, 'readme')])
    expect(saveFile).toHaveBeenLastCalledWith(expect.objectContaining({ fileName: 'readme.md' }))

    await manager.download([entry(manager, 'readme'), entry(manager, 'docs')])
    expect(saveFile).toHaveBeenLastCalledWith(expect.objectContaining({ fileName: 'download.zip' }))
  })

  it('downloads files one by one without archive support', async () => {
    const saveFile = vi.fn()
    const adapter = createAdapter({ capabilities: { downloadMany: false } })
    const { manager, onNotice } = await setup({ saveFile, adapter })

    await manager.download([
      entry(manager, 'readme'),
      entry(manager, 'locked'),
      entry(manager, 'docs'),
    ])

    expect(saveFile).toHaveBeenCalledTimes(2)
    expect(onNotice).toHaveBeenCalledWith(expect.objectContaining({ status: 'warning' }))
  })
})

describe('uploads', () => {
  const file = (name = 'new.txt', size = 4) =>
    new File([new Uint8Array(size)], name, { type: 'text/plain' })

  const settled = async (manager: ReturnType<typeof useFileManager>) => {
    await vi.waitFor(() => expect(manager.uploads.uploading.value).toBe(false))
    await new Promise((resolve) => setTimeout(resolve, 200))
    await flush()
  }

  const statuses = (items: FileUploadItem[]) => items.map((item) => item.status)

  it('uploads files and refreshes the folder', async () => {
    const { manager } = await setup()

    manager.upload([file()])
    await settled(manager)

    expect(statuses(manager.uploads.items.value)).toEqual(['success'])
    expect(manager.uploads.items.value[0].progress).toBe(100)
    expect(names(manager)).toContain('new.txt')
  })

  it('rejects files that break the restrictions', async () => {
    const { manager } = await setup({
      restrictions: { maxFileSize: 5, accept: ['.txt'], maxFiles: 2 },
    })

    manager.upload([
      file('big.txt', 10),
      file('a.exe'),
      file('ok.txt'),
      file('fine.txt'),
      file('over.txt'),
    ])
    await settled(manager)

    expect(statuses(manager.uploads.items.value)).toEqual([
      'rejected',
      'rejected',
      'success',
      'success',
      'rejected',
    ])
    expect(manager.uploads.items.value.map((item) => item.error?.code)).toEqual([
      'too-large',
      'type-not-allowed',
      undefined,
      undefined,
      'invalid-operation',
    ])
  })

  it('keeps relative paths inside the destination', async () => {
    const { manager, adapter } = await setup()

    manager.upload([{ file: file('a.txt'), relativePath: '../../etc/a.txt' }])
    await settled(manager)

    expect(manager.uploads.items.value[0].relativePath).toBe('etc/a.txt')
    expect(adapter.findByPath('/etc/a.txt')).toBeDefined()
  })

  it('respects the concurrency limit', async () => {
    let running = 0
    let peak = 0
    const adapter = createAdapter()
    const upload = adapter.upload!.bind(adapter)

    adapter.upload = async (request) => {
      running += 1
      peak = Math.max(peak, running)
      await new Promise((resolve) => setTimeout(resolve, 5))
      running -= 1
      return upload(request)
    }

    const { manager } = await setup({ adapter, uploadConcurrency: 2 })

    manager.upload([file('a.txt'), file('b.txt'), file('c.txt'), file('d.txt'), file('e.txt')])
    await settled(manager)

    expect(peak).toBe(2)
    expect(manager.uploads.finished.value).toHaveLength(5)
  })

  it('cancels running uploads and retries them', async () => {
    const { manager } = await setup({ adapter: createAdapter({ latency: 5 }) })

    const [item] = manager.upload([file()])

    await new Promise((resolve) => setTimeout(resolve, 2))
    manager.uploads.cancel(item.id)
    await settled(manager)

    expect(statuses(manager.uploads.items.value)).toEqual(['canceled'])

    manager.uploads.retry(item.id)
    await settled(manager)

    expect(statuses(manager.uploads.items.value)).toEqual(['success'])
  })

  it('reports failures and retries them', async () => {
    let failing = true
    const adapter = createAdapter({
      onRequest: (operation) => {
        if (operation === 'upload' && failing) {
          throw new FileManagerError('network', 'Offline')
        }
      },
    })
    const { manager } = await setup({ adapter })

    manager.upload([file()])
    await settled(manager)

    expect(manager.uploads.failed.value[0].error?.message).toBe('Offline')

    failing = false
    manager.uploads.retryFailed()
    await settled(manager)

    expect(manager.uploads.failed.value).toHaveLength(0)
  })

  it('settles conflicts through the resolver', async () => {
    const { manager } = await setup()
    const resolveConflict = vi.fn(async () => ({ strategy: 'rename' as const, applyToAll: true }))

    manager.setHandlers({ resolveConflict })
    manager.upload([file('readme.md'), file('locked.txt')])
    await settled(manager)

    expect(resolveConflict).toHaveBeenCalledTimes(1)
    expect(names(manager)).toEqual(expect.arrayContaining(['readme (2).md', 'locked (2).txt']))
  })

  it('skips on request', async () => {
    const { manager } = await setup()

    manager.setHandlers({ resolveConflict: async () => ({ strategy: 'skip' }) })
    manager.upload([file('readme.md')])
    await settled(manager)

    expect(statuses(manager.uploads.items.value)).toEqual(['skipped'])
  })

  it('uses chunks for large files and resumes after a failure', async () => {
    let failures = 1
    const adapter = createAdapter({
      onRequest: (operation) => {
        if (operation === 'chunkedUpload.uploadChunk' && failures-- === 0) {
          throw new FileManagerError('network', 'Offline')
        }
      },
    })
    const { manager } = await setup({ adapter, chunkSize: 4 })

    const [item] = manager.upload([file('big.bin', 10)])

    await settled(manager)

    const failed = manager.uploads.items.value[0]

    expect(failed.status).toBe('error')
    expect(failed.session?.uploadedBytes).toBe(4)

    manager.uploads.retry(item.id)
    await settled(manager)

    expect(manager.uploads.items.value[0].status).toBe('success')
    expect(entry(manager, manager.uploads.items.value[0].entry!.id).size).toBe(10)
  })

  it('does nothing without upload support or in a virtual location', async () => {
    const { manager } = await setup({
      adapter: createAdapter({ capabilities: { upload: false } }),
    })

    expect(manager.upload([file()])).toEqual([])

    const other = await setup()

    await other.manager.navigate({ type: 'trash' })

    expect(other.manager.upload([file()])).toEqual([])
  })
})

describe('thumbnails and cleanup', () => {
  it('prefers safe urls of the entry and caches adapter thumbnails', async () => {
    const onRequest = vi.fn()
    const adapter = createAdapter({
      onRequest,
      files: [
        { id: 'a', name: 'a.png', thumbnailUrl: 'https://cdn.test/a.png' },
        { id: 'b', name: 'b.png', thumbnailUrl: UNSAFE_URL },
        { id: 'c', name: 'c.png', url: 'https://cdn.test/c.png' },
      ],
    })
    const { manager } = await setup({ adapter })

    expect(await manager.getThumbnail(entry(manager, 'a'))).toBe('https://cdn.test/a.png')
    expect(await manager.getThumbnail(entry(manager, 'b'))).toBeNull()
    expect(await manager.getThumbnail(entry(manager, 'c'))).toBe('https://cdn.test/c.png')

    await manager.getThumbnail(entry(manager, 'c'))

    expect(onRequest.mock.calls.filter(([operation]) => operation === 'getThumbnail')).toHaveLength(
      1,
    )
  })

  it('aborts its work when its scope ends', async () => {
    const adapter = createAdapter({ latency: 50 })
    const scope = effectScope()
    const manager = scope.run(() => useFileManager({ adapter }))!

    const pending = manager.load()

    scope.stop()
    await pending

    expect(manager.items.value).toEqual([])
    expect(manager.error.value).toBeNull()
  })

  it('starts over when the adapter changes', async () => {
    const adapter = shallowRef(createAdapter())
    const manager = useFileManager({ adapter })

    await manager.load()
    await manager.openFolder('docs')
    await flush()
    manager.cut([manager.visibleEntries.value[0]])

    adapter.value = createAdapter({ files: [{ name: 'other.txt', content: 'x' }] })
    await flush()

    expect(names(manager)).toEqual(['other.txt'])
    expect(manager.clipboard.value).toBeNull()
    expect(manager.canGoBack.value).toBe(false)
  })
})
