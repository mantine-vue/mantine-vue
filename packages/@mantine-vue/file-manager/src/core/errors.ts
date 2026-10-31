import type { FileEntry, FileErrorCode, FileErrorInfo } from '../types'

/** Error type adapters reject with, so the interface can react to the reason of a failure. */
export class FileManagerError extends Error {
  readonly code: FileErrorCode

  /** HTTP status, for adapters talking to an HTTP backend. */
  readonly status?: number

  /** Entry that already holds the name, for `conflict` errors. */
  readonly conflictWith?: FileEntry

  constructor(
    code: FileErrorCode,
    message: string,
    options: { status?: number; conflictWith?: FileEntry; cause?: unknown } = {},
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'FileManagerError'
    this.code = code
    this.status = options.status
    this.conflictWith = options.conflictWith
  }
}

export function isAbortError(error: unknown) {
  return (
    (error instanceof FileManagerError && error.code === 'aborted') ||
    (typeof error === 'object' && error !== null && (error as Error).name === 'AbortError')
  )
}

/** Turns anything a backend may throw into the shape the interface works with. */
export function toFileErrorInfo(error: unknown): FileErrorInfo {
  if (error instanceof FileManagerError) {
    return { code: error.code, message: error.message, conflictWith: error.conflictWith }
  }

  if (isAbortError(error)) {
    return { code: 'aborted', message: 'The operation was canceled' }
  }

  if (error instanceof TypeError) {
    return { code: 'network', message: error.message }
  }

  if (error instanceof Error) {
    return { code: 'unknown', message: error.message }
  }

  return { code: 'unknown', message: typeof error === 'string' ? error : 'Unknown error' }
}

/** Rejects with an abort error when the signal already fired. */
export function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    throw new FileManagerError('aborted', 'The operation was canceled')
  }
}
