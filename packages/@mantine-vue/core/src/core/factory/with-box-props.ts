import type { BoxProps } from '../Box'

type InstanceOf<C> = C extends new (...args: any[]) => infer I ? I : object
type OwnProps<C> = InstanceOf<C> extends { $props: infer P } ? P : object

/**
 * @deprecated Use a factory payload instead: `factory()` and `polymorphicFactory()` include
 * `BoxProps` through the payload's `props` interface, and unlike this cast they preserve slots,
 * emits, exposed members, the root ref and polymorphic inference. Kept only so unmigrated
 * components keep type-checking.
 */
export type WithBoxProps<C> = C & {
  new (): InstanceOf<C> & {
    $props: OwnProps<C> & Omit<BoxProps, keyof OwnProps<C>>
  }
}

/**
 * Additively widens a component's template `$props` with `BoxProps`.
 *
 * @deprecated Use a factory payload instead. See {@link WithBoxProps}.
 */
export function withBoxProps<C>(component: C): WithBoxProps<C> {
  return component as WithBoxProps<C>
}
