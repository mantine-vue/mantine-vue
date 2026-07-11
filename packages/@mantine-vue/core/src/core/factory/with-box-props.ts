import type { BoxProps } from '../Box'

/**
 * Additively widens a Vue component's template `$props` with `BoxProps` so that
 * Mantine style props (m, mt, p, w, h, bg, c, …) and Box layout props
 * (hiddenFrom, visibleFrom, mod, …) are available for autocomplete/IntelliSense
 * and type-checking.
 */
type InstanceOf<C> = C extends new (...args: any[]) => infer I ? I : object
type OwnProps<C> = InstanceOf<C> extends { $props: infer P } ? P : object

export type WithBoxProps<C> = C & {
  new (): InstanceOf<C> & {
    $props: OwnProps<C> & Omit<BoxProps, keyof OwnProps<C>>
  }
}

export function withBoxProps<C>(component: C): WithBoxProps<C> {
  return component as WithBoxProps<C>
}
