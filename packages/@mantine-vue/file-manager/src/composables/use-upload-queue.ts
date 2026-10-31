import { computed, shallowRef, type ComputedRef } from 'vue'
import { isAbortError, toFileErrorInfo } from '../core/errors'
import { isFileTypeAccepted } from '../core/file-types'
import { formatFileSize } from '../core/format'
import { getFileNameIssue, sanitizeRelativePath } from '../core/paths'
import type { FileManagerLabels } from '../labels'
import type {
  FileConflictStrategy,
  FileEntry,
  FileErrorInfo,
  FileSystemAdapter,
  FileSystemCapabilities,
  FileUploadItem,
  FileUploadRestrictions,
  FileUploadSession,
} from '../types'

/** A file to upload, with its path inside a dropped or selected folder. */
export interface FileUploadInput {
  file: File
  relativePath?: string
}

/** What the conflict resolver decided. `strategy: null` cancels the remaining work. */
export interface FileConflictDecision {
  strategy: Exclude<FileConflictStrategy, 'fail'> | null
  applyToAll?: boolean
}

export interface UseUploadQueueOptions {
  adapter: ComputedRef<FileSystemAdapter>
  capabilities: ComputedRef<FileSystemCapabilities>
  labels: ComputedRef<FileManagerLabels>
  restrictions: () => FileUploadRestrictions | undefined

  /** Parallel uploads. */
  concurrency: () => number

  /** Chunk size of chunked uploads in bytes. */
  chunkSize: () => number

  conflictStrategy: () => FileConflictStrategy | 'ask'

  /** Asks how to settle a conflict. */
  resolveConflict: (input: {
    name: string
    existing?: FileEntry
    parentId: string | null
    remaining: number
  }) => Promise<FileConflictDecision>

  /** Called after a file reached the backend. */
  onUploaded: (item: FileUploadItem) => void

  /** Called once nothing is queued or running anymore. */
  onSettled?: (items: FileUploadItem[]) => void
}

let nextUploadId = 1

export const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024

/** Tracks uploads: validation, concurrency, conflicts, cancel, retry and resume. */
export function useUploadQueue(options: UseUploadQueueOptions) {
  const items = shallowRef<FileUploadItem[]>([])
  const controllers = new Map<string, AbortController>()

  /** Strategy chosen with "apply to all", valid until the queue drains. */
  let batchStrategy: Exclude<FileConflictStrategy, 'fail'> | null = null

  /** Conflicts are asked one at a time, since only one dialog can be shown. */
  let conflictLock: Promise<unknown> = Promise.resolve()

  const patch = (id: string, changes: Partial<FileUploadItem>) => {
    items.value = items.value.map((item) => (item.id === id ? { ...item, ...changes } : item))
  }

  const getItem = (id: string) => items.value.find((item) => item.id === id)

  const active = computed(() =>
    items.value.filter((item) => item.status === 'queued' || item.status === 'uploading'),
  )
  const finished = computed(() =>
    items.value.filter((item) => item.status !== 'queued' && item.status !== 'uploading'),
  )
  const failed = computed(() => items.value.filter((item) => item.status === 'error'))
  const uploading = computed(() => active.value.length > 0)

  /** Completion of the batch from 0 to 100, weighted by size. */
  const progress = computed(() => {
    const relevant = items.value.filter((item) =>
      ['queued', 'uploading', 'success'].includes(item.status),
    )
    const total = relevant.reduce((sum, item) => sum + item.size, 0)

    if (total === 0) {
      return relevant.length > 0 && relevant.every((item) => item.status === 'success') ? 100 : 0
    }

    return (relevant.reduce((sum, item) => sum + item.loaded, 0) / total) * 100
  })

  function validate(input: FileUploadInput): {
    relativePath?: string
    error?: FileErrorInfo
  } {
    const { file } = input
    const restrictions = options.restrictions()
    const labels = options.labels.value
    const relativePath = input.relativePath ? sanitizeRelativePath(input.relativePath) : undefined

    if (input.relativePath && relativePath === null) {
      return { error: { code: 'invalid-name', message: labels.invalidFileName } }
    }

    if (getFileNameIssue(file.name)) {
      return { error: { code: 'invalid-name', message: labels.invalidFileName } }
    }

    if (restrictions?.maxFileSize !== undefined && file.size > restrictions.maxFileSize) {
      return {
        error: {
          code: 'too-large',
          message: labels.fileTooLarge(formatFileSize(restrictions.maxFileSize)),
        },
      }
    }

    if (!isFileTypeAccepted(file, restrictions?.accept)) {
      return { error: { code: 'type-not-allowed', message: labels.fileTypeNotAllowed } }
    }

    return { relativePath: relativePath ?? undefined }
  }

  /** Adds files to the queue. Returns the created items, rejected ones included. */
  function add(inputs: FileUploadInput[], parentId: string | null) {
    const maxFiles = options.restrictions()?.maxFiles
    let accepted = 0
    const created = inputs.map((input): FileUploadItem => {
      const { error, relativePath } = validate(input)
      const overLimit = !error && maxFiles !== undefined && accepted >= maxFiles

      accepted += error || overLimit ? 0 : 1
      const rejection: FileErrorInfo | undefined =
        error ??
        (overLimit
          ? { code: 'invalid-operation', message: options.labels.value.tooManyFiles(maxFiles) }
          : undefined)

      return {
        id: `upload-${nextUploadId++}`,
        file: input.file,
        name: input.file.name,
        size: input.file.size,
        parentId,
        relativePath,
        status: rejection ? 'rejected' : 'queued',
        loaded: 0,
        progress: 0,
        error: rejection,
      }
    })

    items.value = [...items.value, ...created]
    pump()

    return created
  }

  function pump() {
    const running = items.value.filter((item) => item.status === 'uploading').length
    const slots = options.concurrency() - running
    const next = items.value.filter((item) => item.status === 'queued').slice(0, slots)

    next.forEach((item) => {
      void run(item.id)
    })

    if (running === 0 && next.length === 0 && items.value.length > 0) {
      batchStrategy = null
      options.onSettled?.(items.value)
    }
  }

  function getStrategy(item: FileUploadItem): FileConflictStrategy {
    const configured = options.conflictStrategy()

    return item.conflict ?? batchStrategy ?? (configured === 'ask' ? 'fail' : configured)
  }

  async function transfer(item: FileUploadItem, signal: AbortSignal) {
    const adapter = options.adapter.value
    const chunkSize = options.chunkSize()
    const request = {
      parentId: item.parentId,
      file: item.file,
      relativePath: item.relativePath,
      conflict: getStrategy(item),
      signal,
    }

    const report = (loaded: number) =>
      patch(item.id, {
        loaded,
        progress: item.size === 0 ? 100 : Math.min((loaded / item.size) * 100, 100),
      })

    if (adapter.chunkedUpload && (item.size > chunkSize || !adapter.upload)) {
      const session: FileUploadSession = await adapter.chunkedUpload.start({
        ...request,
        chunkSize,
        resumeId: item.session?.id,
      })

      patch(item.id, { session })
      report(session.uploadedBytes)

      for (let offset = session.uploadedBytes; offset < item.size; ) {
        const chunk = item.file.slice(offset, offset + chunkSize)
        const base = offset

        await adapter.chunkedUpload.uploadChunk({
          session,
          chunk,
          offset,
          signal,
          onProgress: (loaded) => report(base + loaded),
        })

        offset += chunk.size
        session.uploadedBytes = offset
        patch(item.id, { session: { ...session } })
        report(offset)
      }

      return adapter.chunkedUpload.complete({ session, signal })
    }

    if (!adapter.upload) {
      throw new Error('The adapter cannot upload files')
    }

    return adapter.upload({ ...request, onProgress: report })
  }

  function askConflict(item: FileUploadItem, existing: FileEntry | undefined) {
    const answer = conflictLock.then(async () => {
      // Another upload may have answered with "apply to all" while this one was waiting.
      if (batchStrategy) {
        return { strategy: batchStrategy } as FileConflictDecision
      }

      const decision = await options.resolveConflict({
        name: item.name,
        existing,
        parentId: item.parentId,
        remaining: items.value.filter(
          (other) =>
            other.id !== item.id && (other.status === 'queued' || other.status === 'uploading'),
        ).length,
      })

      if (decision.applyToAll && decision.strategy) {
        batchStrategy = decision.strategy
      }

      return decision
    })

    conflictLock = answer.catch(() => undefined)

    return answer
  }

  async function run(id: string) {
    const item = getItem(id)

    if (!item) {
      return
    }

    const controller = new AbortController()

    controllers.set(id, controller)
    patch(id, { status: 'uploading', error: undefined })

    try {
      const entry = await transfer(getItem(id) ?? item, controller.signal)

      patch(id, {
        status: 'success',
        entry,
        loaded: item.size,
        progress: 100,
        session: undefined,
      })

      const uploaded = getItem(id)

      if (uploaded) {
        options.onUploaded(uploaded)
      }
    } catch (error) {
      const info = toFileErrorInfo(error)

      if (isAbortError(error)) {
        patch(id, { status: 'canceled' })
      } else if (info.code === 'conflict' && getStrategy(item) === 'skip') {
        patch(id, { status: 'skipped' })
      } else if (info.code === 'conflict' && getStrategy(item) === 'fail') {
        if (options.conflictStrategy() !== 'ask') {
          patch(id, { status: 'error', error: info })
        } else {
          const decision = await askConflict(item, info.conflictWith)

          if (decision.strategy === 'skip') {
            patch(id, { status: 'skipped' })
          } else if (decision.strategy === null) {
            patch(id, { status: 'canceled' })
          } else {
            patch(id, { status: 'queued', conflict: decision.strategy, loaded: 0, progress: 0 })
          }
        }
      } else {
        patch(id, { status: 'error', error: info })
      }
    } finally {
      controllers.delete(id)
      pump()
    }
  }

  function cancel(id: string) {
    const item = getItem(id)

    if (!item) {
      return
    }

    if (item.status === 'uploading') {
      controllers.get(id)?.abort()
    } else if (item.status === 'queued') {
      patch(id, { status: 'canceled' })
      pump()
    }

    if (item.session) {
      void options.adapter.value.chunkedUpload?.abort({ session: item.session })
      patch(id, { session: undefined, loaded: 0, progress: 0 })
    }
  }

  function retry(id: string) {
    const item = getItem(id)

    if (item && (item.status === 'error' || item.status === 'canceled')) {
      patch(id, {
        status: 'queued',
        error: undefined,
        // A session keeps the progress already stored by the backend.
        loaded: item.session ? item.loaded : 0,
        progress: item.session ? item.progress : 0,
      })
      pump()
    }
  }

  function remove(id: string) {
    cancel(id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  const cancelAll = () => active.value.forEach((item) => cancel(item.id))
  const retryFailed = () => failed.value.forEach((item) => retry(item.id))

  function clearFinished() {
    items.value = items.value.filter(
      (item) => item.status === 'queued' || item.status === 'uploading',
    )
  }

  /** Aborts running transfers without touching resumable sessions on the backend. */
  function dispose() {
    controllers.forEach((controller) => controller.abort())
    controllers.clear()
  }

  return {
    items,
    active,
    finished,
    failed,
    uploading,
    progress,
    add,
    cancel,
    retry,
    remove,
    cancelAll,
    retryFailed,
    clearFinished,
    dispose,
  }
}

export type FileUploadQueue = ReturnType<typeof useUploadQueue>
