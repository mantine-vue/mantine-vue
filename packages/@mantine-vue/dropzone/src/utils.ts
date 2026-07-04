import type { Accept, FileError, FileWithPath } from './types'

export const FILE_INVALID_TYPE = 'file-invalid-type'
export const FILE_TOO_LARGE = 'file-too-large'
export const FILE_TOO_SMALL = 'file-too-small'
export const TOO_MANY_FILES = 'too-many-files'

export const ErrorCode = {
  FileInvalidType: FILE_INVALID_TYPE,
  FileTooLarge: FILE_TOO_LARGE,
  FileTooSmall: FILE_TOO_SMALL,
  TooManyFiles: TOO_MANY_FILES,
} as const

export const getInvalidTypeRejectionErr = (accept = ''): FileError => {
  const acceptArr = accept.split(',')
  const msg = acceptArr.length > 1 ? `one of ${acceptArr.join(', ')}` : acceptArr[0]
  return { code: FILE_INVALID_TYPE, message: `File type must be ${msg}` }
}

export const getTooLargeRejectionErr = (maxSize: number): FileError => ({
  code: FILE_TOO_LARGE,
  message: `File is larger than ${maxSize} ${maxSize === 1 ? 'byte' : 'bytes'}`,
})

export const getTooSmallRejectionErr = (minSize: number): FileError => ({
  code: FILE_TOO_SMALL,
  message: `File is smaller than ${minSize} ${minSize === 1 ? 'byte' : 'bytes'}`,
})

export const TOO_MANY_FILES_REJECTION: FileError = {
  code: TOO_MANY_FILES,
  message: 'Too many files',
}

function isDefined(value: unknown): boolean {
  return value !== undefined && value !== null
}

function attrAccept(file: { name?: string; type?: string }, acceptedFiles?: string): boolean {
  if (!acceptedFiles) {
    return true
  }

  const fileName = file.name || ''
  const mimeType = (file.type || '').toLowerCase()
  const baseMimeType = mimeType.replace(/\/.*$/, '')

  return acceptedFiles
    .split(',')
    .map((type) => type.trim().toLowerCase())
    .some((type) => {
      if (type.startsWith('.')) {
        return fileName.toLowerCase().endsWith(type)
      }
      if (type.endsWith('/*')) {
        return baseMimeType === type.replace(/\/.*$/, '')
      }
      return mimeType === type
    })
}

/**
 * Check if the given file is a DataTransferItem with an empty type. During drag events some
 * browsers report an empty MIME type on DataTransferItem for certain file extensions even though
 * the type is correctly set once the file is actually dropped, so we accept those provisionally.
 */
export function isDataTransferItemWithEmptyType(file: any): boolean {
  return file.type === '' && typeof file.getAsFile === 'function'
}

export function fileAccepted(
  file: FileWithPath | DataTransferItem,
  accept?: string,
): [boolean, FileError | null] {
  const isAcceptable =
    (file as any).type === 'application/x-moz-file' ||
    attrAccept(file as any, accept) ||
    isDataTransferItemWithEmptyType(file)

  return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(accept)]
}

export function fileMatchSize(
  file: FileWithPath,
  minSize?: number,
  maxSize?: number,
): [boolean, FileError | null] {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize!) return [false, getTooLargeRejectionErr(maxSize!)]
      if (file.size < minSize!) return [false, getTooSmallRejectionErr(minSize!)]
    } else if (isDefined(minSize) && file.size < minSize!) {
      return [false, getTooSmallRejectionErr(minSize!)]
    } else if (isDefined(maxSize) && file.size > maxSize!) {
      return [false, getTooLargeRejectionErr(maxSize!)]
    }
  }
  return [true, null]
}

export interface AllFilesAcceptedOptions {
  files: FileWithPath[]
  accept?: string
  minSize?: number
  maxSize?: number
  multiple?: boolean
  maxFiles?: number
  validator?: (file: FileWithPath) => FileError | FileError[] | null
}

export function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles,
  validator,
}: AllFilesAcceptedOptions): boolean {
  if (
    (!multiple && files.length > 1) ||
    (multiple && (maxFiles ?? 0) >= 1 && files.length > maxFiles!)
  ) {
    return false
  }

  return files.every((file) => {
    const [accepted] = fileAccepted(file, accept)
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize)
    const customErrors = validator ? validator(file) : null
    return accepted && sizeMatch && !customErrors
  })
}

export function isEvtWithFiles(event: DragEvent | Event): boolean {
  const dataTransfer = (event as DragEvent).dataTransfer
  if (!dataTransfer) {
    const target = event.target as HTMLInputElement | null
    return !!target && !!target.files
  }
  return Array.prototype.some.call(
    dataTransfer.types || [],
    (type: string) => type === 'Files' || type === 'application/x-moz-file',
  )
}

export function canUseFileSystemAccessAPI(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window
}

/** Convert the `accept` prop into the `{types}` option for `window.showOpenFilePicker`. */
export function pickerOptionsFromAccept(
  accept?: Accept,
): { description: string; accept: Accept }[] | undefined {
  if (!isDefined(accept)) {
    return undefined
  }

  const acceptForPicker = Object.entries(accept!)
    .filter(([mimeType, ext]) => isMIMEType(mimeType) && Array.isArray(ext) && ext.every(isExt))
    .reduce<Accept>((agg, [mimeType, ext]) => ({ ...agg, [mimeType]: ext }), {})

  return [{ description: 'Files', accept: acceptForPicker }]
}

/** Convert the `accept` prop into a comma-separated string suitable for `<input accept>`. */
export function acceptPropAsAcceptAttr(accept?: Accept): string | undefined {
  if (!isDefined(accept)) {
    return undefined
  }

  return Object.entries(accept!)
    .reduce<string[]>((acc, [mimeType, ext]) => [...acc, mimeType, ...ext], [])
    .filter((v) => isMIMEType(v) || isExt(v))
    .join(',')
}

export function isAbort(v: unknown): boolean {
  return (
    v instanceof DOMException &&
    (v.name === 'AbortError' || (v as any).code === (v as any).ABORT_ERR)
  )
}

export function isSecurityError(v: unknown): boolean {
  return (
    v instanceof DOMException &&
    (v.name === 'SecurityError' || (v as any).code === (v as any).SECURITY_ERR)
  )
}

export function isMIMEType(v: string): boolean {
  return (
    v === 'audio/*' ||
    v === 'video/*' ||
    v === 'image/*' ||
    v === 'text/*' ||
    v === 'application/*' ||
    /\w+\/[-+.\w]+/g.test(v)
  )
}

export function isExt(v: string): boolean {
  return /^.*\.[\w]+$/.test(v)
}
