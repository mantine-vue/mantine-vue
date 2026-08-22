import type { WhatsAppInboxLabels } from '../labels'
import { DEFAULT_WHATSAPP_INBOX_LABELS } from '../labels'
import type { WhatsAppMediaConstraints, WhatsAppMediaType, WhatsAppRejectedFile } from '../types'
import { formatFileSize } from './format'

/**
 * `accept` values offered per media type when the consumer does not configure its own.
 *
 * Deliberately broad: the authoritative list of what a provider accepts lives on the backend, and
 * a consumer narrows this through `capabilities.mediaConstraints`.
 */
export const DEFAULT_MEDIA_ACCEPT: Record<WhatsAppMediaType, string[]> = {
  image: ['image/*'],
  video: ['video/*'],
  audio: ['audio/*'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],
  sticker: ['image/webp'],
}

/**
 * Maps a MIME type onto the media type that decides which renderer is used.
 *
 * Never returns `sticker`: stickers are classified by the backend, a picked `.webp` file is an
 * image. Anything unrecognized is a document, which is the renderer that degrades best.
 */
export function getMediaTypeFromMime(mimeType: string | undefined): WhatsAppMediaType {
  const mime = mimeType?.toLowerCase() ?? ''

  if (mime.startsWith('image/')) {
    return 'image'
  }

  if (mime.startsWith('video/')) {
    return 'video'
  }

  if (mime.startsWith('audio/')) {
    return 'audio'
  }

  return 'document'
}

/** Value for the `accept` attribute of the composer file input. */
export function getAcceptAttribute(
  allowedMediaTypes: WhatsAppMediaType[],
  constraints: Partial<Record<WhatsAppMediaType, WhatsAppMediaConstraints>> = {},
): string {
  const accept = allowedMediaTypes.flatMap(
    (mediaType) => constraints[mediaType]?.accept ?? DEFAULT_MEDIA_ACCEPT[mediaType],
  )

  return [...new Set(accept)].join(',')
}

/** Whether a file matches one entry of an `accept` list, which may be a wildcard or extension. */
function matchesAcceptEntry(file: File, entry: string): boolean {
  const normalized = entry.trim().toLowerCase()

  if (normalized.length === 0) {
    return false
  }

  if (normalized.startsWith('.')) {
    return file.name.toLowerCase().endsWith(normalized)
  }

  const mime = file.type.toLowerCase()

  if (normalized.endsWith('/*')) {
    return mime.startsWith(normalized.slice(0, -1))
  }

  return mime === normalized
}

/** Whether a file matches any entry of an `accept` list. An empty list accepts everything. */
export function matchesAccept(file: File, accept: string[] | undefined): boolean {
  if (!accept || accept.length === 0) {
    return true
  }

  return accept.some((entry) => matchesAcceptEntry(file, entry))
}

/** Input of {@link validateFiles}. */
export interface ValidateFilesInput {
  /** Files the user picked. */
  files: File[]

  /** Media types the conversation accepts. */
  allowedMediaTypes: WhatsAppMediaType[]

  /** Per media type constraints from the conversation capabilities. */
  constraints?: Partial<Record<WhatsAppMediaType, WhatsAppMediaConstraints>>

  /** Attachments already staged in the composer, counted against `maxFiles`. */
  existingCount?: number

  /** Labels used to build the rejection messages. */
  labels?: WhatsAppInboxLabels
}

/** Files split into the ones the composer forwards and the ones it refused. */
export interface ValidateFilesResult {
  accepted: File[]
  rejected: WhatsAppRejectedFile[]
}

/**
 * Applies the configured file constraints before any file reaches the consumer.
 *
 * This is the only validation the extension performs on media, and every limit comes from
 * `capabilities` rather than from a hard-coded provider table.
 */
export function validateFiles({
  files,
  allowedMediaTypes,
  constraints = {},
  existingCount = 0,
  labels = DEFAULT_WHATSAPP_INBOX_LABELS,
}: ValidateFilesInput): ValidateFilesResult {
  const accepted: File[] = []
  const rejected: WhatsAppRejectedFile[] = []

  for (const file of files) {
    const mediaType = getMediaTypeFromMime(file.type)
    const isAllowedType = allowedMediaTypes.includes(mediaType)
    const constraint = constraints[mediaType]

    if (!isAllowedType || !matchesAccept(file, constraint?.accept)) {
      rejected.push({
        file,
        code: 'file-invalid-type',
        message: labels.fileInvalidType(file.name),
      })
      continue
    }

    if (constraint?.maxFileSize !== undefined && file.size > constraint.maxFileSize) {
      rejected.push({
        file,
        code: 'file-too-large',
        message: labels.fileTooLarge(file.name, formatFileSize(constraint.maxFileSize)),
      })
      continue
    }

    const maxFiles = constraint?.maxFiles

    if (maxFiles !== undefined && existingCount + accepted.length >= maxFiles) {
      rejected.push({
        file,
        code: 'too-many-files',
        message: labels.tooManyFiles(maxFiles),
      })
      continue
    }

    accepted.push(file)
  }

  return { accepted, rejected }
}
