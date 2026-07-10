export type VueRefTarget<T> = { value: T | null } | ((value: T | null) => void) | undefined

export function assignRef<T>(refTarget: VueRefTarget<T>, value: T | null) {
  if (typeof refTarget === 'function') {
    refTarget(value)
  } else if (refTarget) {
    refTarget.value = value
  }
}

export function mergeRefs<T>(...refs: VueRefTarget<T>[]) {
  return (value: T | null) => refs.forEach((refTarget) => assignRef(refTarget, value))
}

export function useMergedRef<T>(...refs: VueRefTarget<T>[]) {
  return mergeRefs<T>(...refs)
}
