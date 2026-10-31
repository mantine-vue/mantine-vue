import type { FileCategory, FileEntry, FileUploadRestrictions } from '../types'
import { getFileExtension } from './paths'

const EXTENSION_CATEGORIES: Record<Exclude<FileCategory, 'folder' | 'other'>, string[]> = {
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'bmp', 'ico', 'svg', 'heic', 'tiff'],
  video: ['mp4', 'webm', 'ogv', 'mov', 'mkv', 'avi', 'm4v'],
  audio: ['mp3', 'wav', 'ogg', 'oga', 'flac', 'aac', 'm4a', 'opus'],
  pdf: ['pdf'],
  document: ['doc', 'docx', 'odt', 'rtf', 'pages'],
  spreadsheet: ['xls', 'xlsx', 'ods', 'csv', 'tsv', 'numbers'],
  presentation: ['ppt', 'pptx', 'odp', 'key'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
  code: [
    'js',
    'jsx',
    'mjs',
    'cjs',
    'ts',
    'tsx',
    'vue',
    'svelte',
    'html',
    'htm',
    'css',
    'scss',
    'less',
    'json',
    'yaml',
    'yml',
    'toml',
    'xml',
    'py',
    'rb',
    'go',
    'rs',
    'java',
    'kt',
    'swift',
    'c',
    'h',
    'cpp',
    'hpp',
    'cs',
    'php',
    'sh',
    'bash',
    'ps1',
    'sql',
  ],
  text: ['txt', 'md', 'markdown', 'log', 'ini', 'cfg', 'conf', 'env'],
}

const CATEGORY_BY_EXTENSION = new Map(
  Object.entries(EXTENSION_CATEGORIES).flatMap(([category, extensions]) =>
    extensions.map((extension) => [extension, category as FileCategory] as const),
  ),
)

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogv: 'video/ogg',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  m4a: 'audio/mp4',
  pdf: 'application/pdf',
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  json: 'application/json',
}

/** Best-known mime type for a file name, used when the backend does not report one. */
export function getMimeType(name: string) {
  return MIME_TYPES[getFileExtension(name)]
}

/** Text-based formats that do not use the `text/` prefix. */
const TEXT_MIME_TYPE = /^(text\/|application\/(json|xml|javascript|x-yaml|x-sh)|.*\+(json|xml)$)/

function getCategoryFromMimeType(mimeType: string): FileCategory | null {
  if (mimeType === 'application/pdf') {
    return 'pdf'
  }

  const [type] = mimeType.split('/')

  if (type === 'image' || type === 'video' || type === 'audio') {
    return type
  }

  return TEXT_MIME_TYPE.test(mimeType) ? 'text' : null
}

/** Resolves the category of an entry. The extension wins, it is more specific than `text/*`. */
export function getFileCategory(entry: Pick<FileEntry, 'kind' | 'name' | 'mimeType'>) {
  if (entry.kind === 'folder') {
    return 'folder'
  }

  return (
    CATEGORY_BY_EXTENSION.get(getFileExtension(entry.name)) ??
    (entry.mimeType ? getCategoryFromMimeType(entry.mimeType) : null) ??
    'other'
  )
}

/** Whether a file satisfies one accept token: `image/*`, `application/pdf` or `.pdf`. */
function matchesAcceptToken(file: Pick<File, 'name' | 'type'>, token: string) {
  const normalized = token.trim().toLowerCase()

  if (normalized.startsWith('.')) {
    return file.name.toLowerCase().endsWith(normalized)
  }

  if (normalized.endsWith('/*')) {
    return file.type.toLowerCase().startsWith(normalized.slice(0, -1))
  }

  return file.type.toLowerCase() === normalized
}

export function isFileTypeAccepted(
  file: Pick<File, 'name' | 'type'>,
  accept: FileUploadRestrictions['accept'],
) {
  return !accept?.length || accept.some((token) => matchesAcceptToken(file, token))
}

/** Only these protocols may reach `src` attributes of the preview. */
export function isSafePreviewUrl(url: string) {
  try {
    const { protocol } = new URL(url, 'http://localhost')
    return protocol === 'http:' || protocol === 'https:' || protocol === 'blob:'
  } catch {
    return false
  }
}
