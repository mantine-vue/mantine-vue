export interface NormalizeCodeOptions {
  /** If set, indentation of the first line is preserved. @default false */
  withFirstLineIndentation?: boolean
}

/** Removes blank leading lines and trailing whitespace before highlighting or copying code. */
export function normalizeCode(
  code: string,
  { withFirstLineIndentation }: NormalizeCodeOptions = {},
) {
  return withFirstLineIndentation ? code.replace(/^(?:[^\S\r\n]*\r?\n)+|\s+$/g, '') : code.trim()
}
