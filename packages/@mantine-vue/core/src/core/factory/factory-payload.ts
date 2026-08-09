import type { IntrinsicElementAttributes, ReservedProps } from 'vue'
import type { EmptyProps, MantineElementType } from './create-polymorphic-component'

/** `data-*` attributes, which are always permitted alongside a component's own props. */
export type DataAttributes = Record<`data-${string}`, any>

/**
 * Describes everything public about a component: props, slots, emits, exposed members, root
 * ref, Styles API metadata and compound components.
 *
 * One payload per component is hand-written next to its props interface (for example
 * `ButtonFactory` in `Button.types.ts`) and is what the factory builds the public type from.
 * `Record<string, any>` is confined to the constraint -- every concrete payload names a real
 * interface, so no `any` reaches a component's public type.
 */
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

/** The full public props of a non-polymorphic factory component. */
export type FactoryComponentProps<Payload extends FactoryPayload> = Payload['props'] &
  EmitsToProps<Payload['emits']> &
  ElementAttributes<Payload['element'], Payload['props'] & EmitsToProps<Payload['emits']>> &
  ReservedProps
