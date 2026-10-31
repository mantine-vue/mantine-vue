/** Largest file name most file systems accept. */
const MAX_NAME_LENGTH = 255

// oxlint-disable-next-line no-control-regex
const FORBIDDEN_CHARACTERS = /[/\\:*?"<>|\u0000-\u001f\u007f]/

/** Device names Windows refuses, with or without an extension. */
const RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i

export type FileNameIssue = 'empty' | 'too-long' | 'forbidden-character' | 'reserved'

/**
 * Checks a name typed by the user or received from an upload.
 *
 * This is the strictest common rule set rather than a mirror of one operating system, so a name
 * accepted here stays usable when the file is downloaded elsewhere. It improves feedback and
 * does not replace validation on the server.
 */
export function getFileNameIssue(name: string): FileNameIssue | null {
  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return 'empty'
  }

  if (name.length > MAX_NAME_LENGTH) {
    return 'too-long'
  }

  if (FORBIDDEN_CHARACTERS.test(name)) {
    return 'forbidden-character'
  }

  if (trimmed === '.' || trimmed === '..' || name.endsWith('.') || name.endsWith(' ')) {
    return 'forbidden-character'
  }

  return RESERVED_NAMES.test(trimmed) ? 'reserved' : null
}

export function isValidFileName(name: string) {
  return getFileNameIssue(name) === null
}

/**
 * Reduces a path coming from a dropped folder to safe relative segments.
 *
 * Browsers and hand-crafted drag events can supply absolute paths or `..` segments. Those are
 * dropped rather than resolved, so an upload can never climb out of its destination folder.
 * Returns `null` when no valid file name remains.
 */
export function sanitizeRelativePath(path: string) {
  const segments = path
    .replace(/\\/g, '/')
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.' && segment !== '..')

  return segments.length > 0 && segments.every(isValidFileName) ? segments.join('/') : null
}

/** Splits `archive.tar.gz` into `archive.tar` and `.gz`. Dotfiles have no extension. */
export function splitFileName(name: string) {
  const index = name.lastIndexOf('.')

  return index <= 0
    ? { base: name, extension: '' }
    : { base: name.slice(0, index), extension: name.slice(index) }
}

export function getFileExtension(name: string) {
  return splitFileName(name).extension.slice(1).toLowerCase()
}

/** Returns `name` or the first `name (n).ext` that `isTaken` accepts. */
export function getAvailableName(name: string, isTaken: (candidate: string) => boolean) {
  if (!isTaken(name)) {
    return name
  }

  const { base, extension } = splitFileName(name)

  for (let index = 2; ; index += 1) {
    const candidate = `${base} (${index})${extension}`

    if (!isTaken(candidate)) {
      return candidate
    }
  }
}
