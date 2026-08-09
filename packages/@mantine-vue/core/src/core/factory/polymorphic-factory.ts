import type { Component, EmitFn } from 'vue'
import type {
  MantineElementType,
  PolymorphicComponentProps,
  PolymorphicMarker,
  PolymorphicRef,
} from './create-polymorphic-component'
import {
  attachStatics,
  type ComponentClasses,
  type ComponentVariablesResolver,
  type RootRefProps,
  type StaticComponents,
  type ThemeExtend,
} from './factory'
import type { EmitsToProps, PolymorphicFactoryPayload } from './factory-payload'

/**
 * Full props of a polymorphic component for a given root `C`: the component's own props,
 * the root's props, emit handlers and the typed `rootRef`.
 */
export type PolymorphicProps<
  C,
  Payload extends PolymorphicFactoryPayload,
> = PolymorphicComponentProps<C, Payload['props'] & EmitsToProps<Payload['emits']>> &
  RootRefProps<PolymorphicRef<C>>

export interface PolymorphicComponentWithProps<Payload extends PolymorphicFactoryPayload> {
  /**
   * Returns a new component with props pre-applied, keeping polymorphic inference.
   *
   * A `component` fixed here becomes the new component's default root, so
   * `Button.withProps({ component: RouterLink })` yields a component that accepts
   * `RouterLink`'s props. Props passed by the caller win over the fixed ones.
   */
  withProps: <Fixed extends MantineElementType = Payload['defaultComponent']>(
    fixedProps: PolymorphicProps<Fixed, Payload>,
  ) => MantinePolymorphicComponent<Payload, Fixed>
}

/**
 * Public type of a polymorphic factory component.
 *
 * A generic function component, which is what lets `vue-tsc` infer the root from
 * `component` in templates. The `C extends MantineElementType` constraint is essential:
 * without it a static `component="a"` widens to `string`, the root's props resolve to `{}`
 * and every root attribute silently stops being checked.
 *
 * Slots are declared on the second parameter, which is where `vue-tsc` reads them from for
 * function components.
 *
 * `emit` uses Vue's own `EmitFn` -- a *function* derived from the payload's `emits` map, not the
 * map itself. The `ctx` parameter is checked contravariantly against the context Vue passes, so
 * declaring the raw map here makes the component unassignable to `FunctionalComponent` and
 * breaks every `h(Component, …)` call for any component that declares emits. Typed events still
 * reach consumers through the `onEvent` props `EmitsToProps` adds.
 */
export type MantinePolymorphicComponent<
  Payload extends PolymorphicFactoryPayload,
  Default extends MantineElementType = Payload['defaultComponent'],
> = (<C extends MantineElementType = Default>(
  props: PolymorphicProps<C, Payload>,
  ctx?: { slots: Payload['slots']; emit: EmitFn<Payload['emits']> },
) => unknown) &
  PolymorphicMarker<Payload, Default> &
  ThemeExtend<Payload> &
  ComponentClasses<Payload> &
  ComponentVariablesResolver<Payload> &
  PolymorphicComponentWithProps<Payload> &
  StaticComponents<Payload['staticComponents']>

/**
 * Attaches the Mantine static API to a polymorphic component implementation.
 *
 * As with `factory`, the implementation stays an ordinary SFC; only the statics and the
 * exported type change.
 */
export function polymorphicFactory<Payload extends PolymorphicFactoryPayload>(
  ui: Component,
  statics?: Payload['staticComponents'] & {
    classes?: Record<string, string>
    varsResolver?: unknown
  },
) {
  return attachStatics(ui, statics) as unknown as MantinePolymorphicComponent<Payload>
}
