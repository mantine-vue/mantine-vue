/**
 * Returns `attrs` without the given keys.
 *
 * @example
 * const forwardedAttrs = computed(() => omitAttrs(attrs, ['onClick', 'onKeydown']))
 */
export function omitAttrs(
  attrs: Record<string, unknown>,
  keys: readonly string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(attrs)) {
    if (!keys.includes(key)) {
      result[key] = attrs[key]
    }
  }

  return result
}
