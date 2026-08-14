import type { Component, IntrinsicElementAttributes, ReservedProps } from 'vue'
import type { DataAttributes, EmitsToProps } from './factory-payload'
import type { RootRefProps } from './factory'

/** Every value the `component` prop accepts: an intrinsic tag name or a Vue component. */
export type MantineElementType = keyof IntrinsicElementAttributes | Component

/**
 * Neutral element for the prop intersections in this module.
 *
 * `unknown` because `T & unknown` reduces to exactly `T`. Not `Record<string, never>`, which
 * would intersect every prop down to `never`.
 */
export type EmptyProps = unknown

/** Props contributed by the value passed to `component`. */
export type PropsOf<C> = C extends keyof IntrinsicElementAttributes
  ? IntrinsicElementAttributes[C]
  : C extends abstract new (...args: any[]) => { $props: infer Props }
    ? Props
    : C extends (props: infer Props, ...args: any[]) => any
      ? Props
      : EmptyProps

/**
 * Lets a polymorphic component's payload and default root be recovered from its type alone,
 * which TypeScript cannot otherwise do because it cannot read a type parameter's default.
 *
 * Without this, `PropsOf<typeof Button>` resolves at the constraint (`MantineElementType`),
 * whose functional-component member infers props as `any`, collapsing the whole result to `any`
 * and silently accepting every invalid prop. Never present at runtime.
 *
 * @internal
 */
export declare const MANTINE_PAYLOAD: unique symbol

export interface PolymorphicMarker<Payload, Default> {
  /** @internal type-only, never assigned */
  readonly [MANTINE_PAYLOAD]?: { payload: Payload; default: Default }
}

/**
 * Public props of any component, polymorphic or not.
 *
 * Replaces `InstanceType<typeof Component>['$props']`, which cannot work for polymorphic
 * components. Pass `Root` to resolve against a root other than the default.
 */
export type ComponentProps<C, Root = void> =
  C extends PolymorphicMarker<infer Payload, infer Default>
    ? // `emits?: infer Emits` rather than a `extends { emits: any }` guard: a guard that yields
      // `never` for payloads without emits would distribute through `EmitsToProps` and collapse
      // the whole props type to `never`.
      Payload extends { props: any; emits?: infer Emits }
      ? // `RootRefProps` is part of the call signature (`PolymorphicProps`), so it belongs here
        // too -- otherwise this accessor describes props the component accepts but omits `rootRef`.
        PolymorphicComponentProps<
          Root extends void ? Default : Root,
          Payload['props'] & EmitsToProps<Emits>
        > &
          RootRefProps<PolymorphicRef<Root extends void ? Default : Root>>
      : PropsOf<C>
    : C extends abstract new (...args: any[]) => { $props: infer Props }
      ? Props
      : PropsOf<C>

/** The DOM node the root resolves to: `HTMLAnchorElement` for `'a'`, `Element` otherwise. */
export type PolymorphicRef<C> = C extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[C]
  : Element

/**
 * Props of a polymorphic component for a given root `C`.
 *
 * `Props` is subtracted from the root's props, so a Mantine prop wins over a conflicting root
 * prop of the same name. `ReservedProps` is added unconditionally, without which
 * `<Button ref="el" />` would be rejected once `strictTemplates` is enabled.
 */
export type PolymorphicComponentProps<C, Props = EmptyProps> = Props &
  Omit<PropsOf<C>, keyof Props> &
  DataAttributes &
  ReservedProps & {
    /**
     * Root element or component rendered by this component.
     *
     * Accepts an intrinsic tag name (`component="a"`) or a Vue component
     * (`:component="RouterLink"`). Props of the selected root are inferred and type-checked
     * alongside the component's own props.
     */
    component?: C
  }

/** Casts an existing implementation to a polymorphic component type. */
export function createPolymorphicComponent<
  ComponentDefaultType extends MantineElementType,
  Props,
  Statics = Record<string, never>,
>(component: unknown) {
  type PolymorphicComponent = (<C extends MantineElementType = ComponentDefaultType>(
    props: PolymorphicComponentProps<C, Props>,
  ) => unknown) &
    Statics

  return component as PolymorphicComponent
}

export const polymorphic = createPolymorphicComponent
