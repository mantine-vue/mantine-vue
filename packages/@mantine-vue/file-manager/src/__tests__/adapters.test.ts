import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRestAdapter } from '../adapters/create-rest-adapter'
import { createZipArchive } from '../adapters/zip'
import { FileManagerError } from '../core/errors'
import { createAdapter } from './test-utils'

const ids = (result: { items: { id: string }[] }) => result.items.map((item) => item.id)

describe('createMemoryAdapter', () => {
  it('lists folders with their ancestors', async () => {
    const adapter = createAdapter()
    const result = await adapter.list({ folderId: 'archive' })

    expect(ids(result)).toEqual(['old'])
    expect(result.folder.name).toBe('Archive')
    expect(result.ancestors.map((item) => item.name)).toEqual(['Home', 'Documents'])
    expect(result.folder.path).toBe('/Documents/Archive')
  })

  it('pages with cursors', async () => {
    const adapter = createAdapter()
    const first = await adapter.list({ folderId: null, limit: 3 })
    const second = await adapter.list({ folderId: null, limit: 3, cursor: first.nextCursor! })

    expect(first.items).toHaveLength(3)
    expect(first.total).toBe(4)
    expect(second.items).toHaveLength(1)
    expect(second.nextCursor).toBeNull()
  })

  it('rejects invalid and duplicate names', async () => {
    const adapter = createAdapter()

    await expect(adapter.createFolder!({ parentId: null, name: 'a/b' })).rejects.toMatchObject({
      code: 'invalid-name',
    })
    await expect(adapter.createFolder!({ parentId: null, name: 'PHOTOS' })).rejects.toMatchObject({
      code: 'conflict',
    })
  })

  it('renames and enforces permissions', async () => {
    const adapter = createAdapter()

    expect((await adapter.rename!({ id: 'readme', name: 'intro.md' })).path).toBe('/intro.md')
    await expect(adapter.rename!({ id: 'locked', name: 'x.txt' })).rejects.toMatchObject({
      code: 'permission-denied',
    })
  })

  it('reports partial failures of a move per item', async () => {
    const adapter = createAdapter()
    const result = await adapter.move!({
      ids: ['readme', 'locked', 'missing'],
      targetId: 'docs',
      conflict: 'fail',
    })

    expect(result.succeeded.map((item) => item.sourceId)).toEqual(['readme'])
    expect(result.failed.map((item) => item.error.code)).toEqual(['permission-denied', 'not-found'])
  })

  it('refuses to move a folder into itself', async () => {
    const adapter = createAdapter()
    const result = await adapter.move!({ ids: ['docs'], targetId: 'archive', conflict: 'fail' })

    expect(result.failed[0].error.code).toBe('invalid-operation')
  })

  it.each([
    ['fail', 'conflict', undefined],
    ['rename', undefined, 'report (2).pdf'],
  ] as const)('settles name conflicts with %s', async (conflict, code, name) => {
    const adapter = createAdapter({
      files: [
        { id: 'a', name: 'report.pdf', size: 1 },
        { id: 'folder', name: 'folder', children: [{ id: 'b', name: 'report.pdf', size: 2 }] },
      ],
    })
    const result = await adapter.move!({ ids: ['a'], targetId: 'folder', conflict })

    expect(result.failed[0]?.error.code).toBe(code)
    expect(result.succeeded[0]?.entry?.name).toBe(name)
  })

  it('skips and overwrites on request', async () => {
    const files = () => [
      { id: 'a', name: 'report.pdf', size: 1 },
      { id: 'folder', name: 'folder', children: [{ id: 'b', name: 'report.pdf', size: 2 }] },
    ]
    const skipping = createAdapter({ files: files() })

    expect(
      (await skipping.copy!({ ids: ['a'], targetId: 'folder', conflict: 'skip' })).skipped,
    ).toEqual(['a'])

    const overwriting = createAdapter({ files: files() })

    await overwriting.move!({ ids: ['a'], targetId: 'folder', conflict: 'overwrite' })

    const listed = await overwriting.list({ folderId: 'folder' })

    expect(ids(listed)).toEqual(['a'])
  })

  it('copies whole subtrees', async () => {
    const adapter = createAdapter()
    const result = await adapter.copy!({ ids: ['docs'], targetId: 'photos', conflict: 'fail' })
    const copy = result.succeeded[0].entry!

    expect(copy.path).toBe('/Photos/Documents')
    expect((await adapter.list({ folderId: copy.id })).items).toHaveLength(3)
  })

  it('moves entries through the trash and restores them', async () => {
    const adapter = createAdapter()

    await adapter.trash!({ ids: ['docs'] })

    expect(ids(await adapter.list({ folderId: null }))).not.toContain('docs')
    expect(ids(await adapter.listTrash!({}))).toEqual(['docs'])
    expect(adapter.findByPath('/Documents')).toBeDefined()

    await adapter.restore!({ ids: ['docs'] })

    expect(ids(await adapter.list({ folderId: null }))).toContain('docs')
    expect((await adapter.listTrash!({})).items).toHaveLength(0)
  })

  it('restores to the root when the original folder is gone', async () => {
    const adapter = createAdapter()

    await adapter.trash!({ ids: ['readme'] })
    await adapter.trash!({ ids: ['report'] })
    await adapter.delete!({ ids: ['docs'] })

    const result = await adapter.restore!({ ids: ['report'] })

    expect(result.succeeded).toHaveLength(0)
    expect(result.failed[0].error.code).toBe('not-found')

    const restored = await adapter.restore!({ ids: ['readme'] })

    expect(restored.succeeded[0].entry?.path).toBe('/readme.md')
  })

  it('searches recursively and skips the trash', async () => {
    const adapter = createAdapter()

    expect(ids(await adapter.search!({ query: 'OLD', folderId: null, recursive: true }))).toEqual([
      'old',
    ])
    expect(
      (await adapter.search!({ query: 'old', folderId: null, recursive: false })).items,
    ).toEqual([])

    await adapter.trash!({ ids: ['archive'] })

    expect(
      (await adapter.search!({ query: 'old', folderId: null, recursive: true })).items,
    ).toEqual([])
  })

  it('creates folders for a relative upload path', async () => {
    const adapter = createAdapter()
    const entry = await adapter.upload!({
      parentId: 'docs',
      file: new File(['x'], 'a.txt'),
      relativePath: 'new/deep/a.txt',
      conflict: 'fail',
    })

    expect(entry.path).toBe('/Documents/new/deep/a.txt')
  })

  it('enforces the quota', async () => {
    const adapter = createAdapter({ quota: 3000 })

    await expect(
      adapter.upload!({
        parentId: null,
        file: new File([new Uint8Array(4000)], 'big.bin'),
        conflict: 'fail',
      }),
    ).rejects.toMatchObject({ code: 'quota-exceeded' })
  })

  it('assembles chunked uploads and resumes sessions', async () => {
    const adapter = createAdapter()
    const chunked = adapter.chunkedUpload!
    const file = new File(['abcdef'], 'chunks.txt', { type: 'text/plain' })
    const request = { parentId: null, file, conflict: 'fail' as const, chunkSize: 3 }
    const session = await chunked.start(request)

    await chunked.uploadChunk({ session, chunk: file.slice(0, 3), offset: 0 })

    const resumed = await chunked.start({ ...request, resumeId: session.id })

    expect(resumed).toEqual({ id: session.id, uploadedBytes: 3 })
    await expect(
      chunked.uploadChunk({ session, chunk: file.slice(3, 6), offset: 5 }),
    ).rejects.toMatchObject({ code: 'invalid-operation' })

    await chunked.uploadChunk({ session, chunk: file.slice(3, 6), offset: 3 })

    const entry = await chunked.complete({ session })

    expect(entry.size).toBe(6)
  })

  it('honors abort signals', async () => {
    const adapter = createAdapter({ latency: 1000 })
    const controller = new AbortController()
    const request = adapter.list({ folderId: null, signal: controller.signal })

    controller.abort()

    await expect(request).rejects.toMatchObject({ code: 'aborted' })
  })

  it('previews text, refuses what has no content and tracks favorites', async () => {
    const adapter = createAdapter()

    expect(await adapter.getPreview!({ id: 'readme' })).toMatchObject({ text: '# Hi' })
    await expect(adapter.getPreview!({ id: 'report' })).rejects.toMatchObject({ code: 'not-found' })

    await adapter.setStarred!({ ids: ['readme'], starred: true })

    expect(ids(await adapter.listStarred!({}))).toEqual(['readme'])
  })

  it('builds a valid archive', async () => {
    const adapter = createAdapter()
    const result = await adapter.downloadMany!({ ids: ['docs'] })
    const bytes = new Uint8Array(await result.blob!.arrayBuffer())

    expect(result.fileName).toBe('download.zip')
    expect(Array.from(bytes.slice(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04])
  })
})

describe('createZipArchive', () => {
  it('writes the end of central directory record', async () => {
    const blob = createZipArchive([{ path: 'a.txt', content: new TextEncoder().encode('a') }])
    const bytes = new Uint8Array(await blob.arrayBuffer())

    expect(Array.from(bytes.slice(-22, -18))).toEqual([0x50, 0x4b, 0x05, 0x06])
    expect(bytes[bytes.length - 10]).toBe(46 + 5)
  })
})

describe('createRestAdapter', () => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })

  const entry = { id: 'a b', name: 'a', kind: 'file', parentId: null }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls the documented endpoints and encodes ids', async () => {
    const fetchMock = vi.fn(async () =>
      json({ folder: entry, ancestors: [], items: [entry], nextCursor: 'n' }),
    )
    const adapter = createRestAdapter({
      baseUrl: 'https://api.test/files',
      fetch: fetchMock as any,
      headers: { Authorization: 'Bearer x' },
      capabilities: { trash: false },
    })

    const result = await adapter.list({
      folderId: 'a/../b',
      limit: 10,
      sort: { field: 'name', direction: 'asc' },
    })

    const [url, init] = (fetchMock.mock.calls as any)[0]

    expect(url).toBe(
      'https://api.test/files/folders/a%2F..%2Fb/children?limit=10&sort=name&direction=asc',
    )
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer x')
    expect(result.nextCursor).toBe('n')
    expect(adapter.capabilities?.trash).toBe(false)
  })

  it('maps raw entries', async () => {
    const adapter = createRestAdapter({
      baseUrl: '',
      fetch: (async () => json({ ...entry, title: 'Mapped' })) as any,
      mapEntry: (raw) => ({ ...raw, name: raw.title }),
    })

    expect((await adapter.get!({ id: 'x' })).name).toBe('Mapped')
  })

  it.each([
    [403, 'permission-denied'],
    [404, 'not-found'],
    [409, 'conflict'],
    [413, 'too-large'],
    [507, 'quota-exceeded'],
    [500, 'unknown'],
  ])('maps status %i to %s', async (status, code) => {
    const adapter = createRestAdapter({
      baseUrl: '',
      fetch: (async () => json({ message: 'Nope' }, status)) as any,
    })

    await expect(adapter.get!({ id: 'x' })).rejects.toMatchObject({ code, message: 'Nope', status })
  })

  it('treats a missing thumbnail as no thumbnail', async () => {
    const adapter = createRestAdapter({
      baseUrl: '',
      fetch: (async () => json({}, 404)) as any,
    })

    expect(await adapter.getThumbnail!({ id: 'x', width: 1, height: 1 })).toBeNull()
  })

  it('reads the file name of downloads', async () => {
    const adapter = createRestAdapter({
      baseUrl: '',
      fetch: (async () =>
        new Response('content', {
          headers: { 'Content-Disposition': 'attachment; filename="report.pdf"' },
        })) as any,
    })

    expect((await adapter.download!({ id: 'x' })).fileName).toBe('report.pdf')
  })

  it('uploads with progress and supports cancellation', async () => {
    const instances: any[] = []

    class FakeXhr {
      upload: any = {}
      status = 200
      responseText = JSON.stringify(entry)
      withCredentials = false
      headers: Record<string, string> = {}
      method = ''
      url = ''
      onload?: () => void
      onabort?: () => void

      constructor() {
        instances.push(this)
      }

      open(method: string, url: string) {
        this.method = method
        this.url = url
      }

      setRequestHeader(key: string, value: string) {
        this.headers[key] = value
      }

      send() {}

      abort() {
        this.onabort?.()
      }
    }

    vi.stubGlobal('XMLHttpRequest', FakeXhr)

    const adapter = createRestAdapter({ baseUrl: 'https://api.test', headers: { 'X-Key': '1' } })
    const onProgress = vi.fn()
    const upload = adapter.upload!({
      parentId: 'p',
      file: new File(['abc'], 'a.txt'),
      conflict: 'fail',
      onProgress,
    })

    await Promise.resolve()
    await Promise.resolve()

    const xhr = instances[0]

    expect(xhr.url).toBe('https://api.test/files')
    expect(xhr.headers['x-key']).toBe('1')

    xhr.upload.onprogress({ lengthComputable: true, loaded: 1, total: 3 })
    xhr.onload()

    expect(await upload).toMatchObject({ id: 'a b' })
    expect(onProgress).toHaveBeenCalledWith(1, 3)

    const controller = new AbortController()
    const canceled = adapter.upload!({
      parentId: null,
      file: new File(['abc'], 'a.txt'),
      conflict: 'fail',
      signal: controller.signal,
    })

    await Promise.resolve()
    await Promise.resolve()
    controller.abort()

    await expect(canceled).rejects.toBeInstanceOf(FileManagerError)
  })
})
