import type { BoxProps } from '../Box'

/**
 * Additively widens a Vue component's template `$props` with `BoxProps` so that
 * Mantine style props (m, mt, p, w, h, bg, c, …) and Box layout props
 * (hiddenFrom, visibleFrom, mod, …) are available for autocomplete/IntelliSense
 * and type-checking.
 *
 * Runtime is untouched: these props already pass through to the underlying Box
 * as fall-through attributes. The merge happens at the instance level
 * (`InstanceType<C> & { $props: BoxProps }`) so the component's own props,
 * slots, emits and static members (e.g. `Group`) are all preserved.
 */
export type WithBoxProps<C> = C & {
  new (): (C extends new (...args: any[]) => infer I ? I : {}) & { $props: BoxProps }
}

export function withBoxProps<C>(component: C): WithBoxProps<C> {
  return component as WithBoxProps<C>
}
