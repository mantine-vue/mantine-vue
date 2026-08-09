import type { GetSplittedTagsInput } from './TagsInput.types'

/**
 * Splits a raw input value into tags and merges them into the current ones.
 *
 * Duplicates and the `maxTags` limit are enforced here rather than by the caller,
 * because a single paste can produce many tags and each has to be checked against the
 * ones accumulated so far, not just against the tags that existed before the paste.
 */
export function getSplittedTags({
  value,
  splitChars = [','],
  currentTags = [],
  allowDuplicates = false,
  maxTags = Infinity,
  isDuplicate,
  onDuplicate,
}: GetSplittedTagsInput): string[] {
  const pattern = new RegExp(
    `[${splitChars.map((char: string) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`,
  )
  const result = [...currentTags]

  value
    .split(pattern)
    .map((tag: string) => tag.trim())
    .filter(Boolean)
    .forEach((tag: string) => {
      const duplicate = isDuplicate
        ? isDuplicate(tag, result)
        : result.some((item) => item.toLowerCase() === tag.toLowerCase())

      if (duplicate) {
        onDuplicate?.(tag)

        if (!allowDuplicates) {
          return
        }
      }

      if (result.length < maxTags) {
        result.push(tag)
      }
    })

  return result
}
