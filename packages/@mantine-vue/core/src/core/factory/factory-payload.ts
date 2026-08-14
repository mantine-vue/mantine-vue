import type { IntrinsicElementAttributes, ReservedProps } from 'vue'
import type { EmptyProps, MantineElementType } from './create-polymorphic-component'

/** `data-*` attributes, which are always permitted alongside a component's own props. */
export type DataAttributes = Record<`data-${string}`, any>

/** Describes the public types and metadata used to construct a factory component. */
export interface FactoryPayload {
  /** The component's full public props interface, including `BoxProps` when supported. */
  props: Record<string, any>

  /** Slots, in `defineSlots` shape: `{ default?: () => VNodeChild }`. */
  slots?: Record<string, any>

  /**
   * Emitted events, in either shape `defineEmits` accepts: `{ error: [event: Event] }` or
   * `{ error: (event: Event) => void }`.
   *
   * The overloaded call-signature form is not supported -- TypeScript cannot map over
   * overloads, so every event but the last would be silently dropped.
   */
  emits?: Record<string, any>

  /** Members made available through `defineExpose`, reachable via a template `ref`. */
  exposed?: Record<string, any>

  /**
   * Extra context the Styles API resolvers receive as their third argument, for components whose
   * classes or CSS variables depend on state rather than props alone
   */
  ctx?: Record<string, any>

  /** The DOM node the component's root resolves to. */
  ref?: any

  /**
   * Intrinsic tag the root renders, for non-polymorphic components. Contributes that element's
   * native attributes and event handlers.
   */
  element?: keyof IntrinsicElementAttributes

  /** Union of Styles API selectors, for example `'root' | 'label'`. */
  stylesNames?: string

  /** Maps each style name to the CSS variables set on it. */
  vars?: Record<string, any>

  /** Union of supported `variant` values. */
  variant?: string

  /** Compound components exposed as statics, for example `{ Group: typeof ButtonGroup }`. */
  staticComponents?: Record<string, any>

  /** Marks a compound component, whose `extend` accepts only `defaultProps`. */
  compound?: boolean
}

/** A payload for a polymorphic component, which additionally declares its default root. */
export interface PolymorphicFactoryPayload extends FactoryPayload {
  /** Root rendered when `component` is not set. */
  defaultComponent: MantineElementType

  /** DOM node the default root resolves to. */
  defaultRef: any
}

/**
 * Turns a payload's `emits` into the `onEvent` props Vue exposes, handling both `defineEmits`
 * shapes. `Capitalize` also yields the right `v-model` name, so `{ 'update:opened': [boolean] }`
 * becomes `{ 'onUpdate:opened'?: … }`.
 */
export type EmitsToProps<Emits> = Emits extends object
  ? {
      [Key in keyof Emits & string as `on${Capitalize<Key>}`]?: Emits[Key] extends any[]
        ? (...args: Emits[Key]) => void
        : Emits[Key]
    }
  : EmptyProps

/**
 * Native attributes contributed by a payload's `element`.
 *
 * Anything the component already declares is subtracted, so its own `onChange` wins over the
 * DOM's. Without the subtraction the two intersect into an uncallable signature.
 */
export type ElementAttributes<Element, Declared> = Element extends keyof IntrinsicElementAttributes
  ? Omit<IntrinsicElementAttributes[Element], keyof Declared>
  : EmptyProps

/**
 * The full public props of a non-polymorphic factory component.
 *
 * `DataAttributes` is part of the contract because `data-*` is valid on every element and Vue's
 * `IntrinsicElementAttributes` does not model it. Without it, `:data-active="…"` on a factory
 * component is rejected under `strictTemplates` even though the DOM accepts it.
 */
export type FactoryComponentProps<Payload extends FactoryPayload> = Payload['props'] &
  EmitsToProps<Payload['emits']> &
  ElementAttributes<Payload['element'], Payload['props'] & EmitsToProps<Payload['emits']>> &
  DataAttributes &
  ReservedProps
