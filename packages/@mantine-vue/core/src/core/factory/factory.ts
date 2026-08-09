import { defineComponent, h, type Component, type EmitFn } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { MantineThemeComponent } from '../MantineProvider'
import type { EmptyProps } from './create-polymorphic-component'
import type { DataAttributes, FactoryComponentProps, FactoryPayload } from './factory-payload'
import type {
  FactoryClassNames,
  FactoryPartialVarsResolver,
  FactoryStyles,
  FactoryVarsResolver,
  StylesNamesOf,
} from './factory-styles-api'

/**
 * Receives the component's root DOM node, since a template `ref` on a component resolves to
 * that component's instance and Vue offers no supported way to change it.
 *
 * Use the callback form in templates -- Vue unwraps refs when binding, so `:rootRef="el"` would
 * pass the element rather than the ref object. A ref object works from `h()`. The node is also
 * exposed as `rootElement`. See the polymorphic components guide.
 */
export type RootRefProp<Element> = VueRefTarget<Element>

export interface RootRefProps<Element> {
  /** Receives the component's root DOM node. See `RootRefProp`. */
  rootRef?: RootRefProp<Element>
}

/** `extend` input for a compound component: only `defaultProps` */
export interface ExtendCompoundComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload['props']> & DataAttributes
}

/** `extend` input for a root component: default props plus full Styles API configuration. */
export interface ExtendsRootComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload['props']> & DataAttributes & { component?: any }
  classNames?: FactoryClassNames<Payload>
  styles?: FactoryStyles<Payload>
  vars?: FactoryPartialVarsResolver<Payload>
}

export type ExtendComponent<Payload extends FactoryPayload> = Payload['compound'] extends true
  ? ExtendCompoundComponent<Payload>
  : ExtendsRootComponent<Payload>

export interface ThemeExtend<Payload extends FactoryPayload> {
  /** Builds a `MantineProvider` theme entry for this component. */
  extend: (input: ExtendComponent<Payload>) => MantineThemeComponent
}

/**
 * The component's CSS module classes, keyed by its style names. Resolves to `never` for
 * components that declare no `stylesNames`, so the property cannot be misused.
 */
export type ComponentClasses<Payload extends FactoryPayload> = {
  classes: Payload['stylesNames'] extends string ? Record<StylesNamesOf<Payload>, string> : never
}

/** `varsResolver` is exposed only by components that declare CSS variables. */
export type ComponentVariablesResolver<Payload extends FactoryPayload> =
  Payload['vars'] extends Record<string, any>
    ? { varsResolver: FactoryVarsResolver<Payload> }
    : EmptyProps

/** Compound components spread onto the component as statics. */
export type StaticComponents<Input> =
  Input extends Record<string, any> ? Input : Record<string, never>

export interface FactoryComponentWithProps<Payload extends FactoryPayload> {
  /**
   * Returns a new component with `props` pre-applied. Props passed by the caller win over
   * the fixed ones.
   */
  withProps: (props: Partial<Payload['props']>) => MantineComponent<Payload>
}

export type MantineComponentStaticProperties<Payload extends FactoryPayload> =
  ThemeExtend<Payload> &
    ComponentClasses<Payload> &
    ComponentVariablesResolver<Payload> &
    FactoryComponentWithProps<Payload> &
    StaticComponents<Payload['staticComponents']>

/**
 * Public type of a non-polymorphic factory component.
 *
 * Declared with a construct signature rather than as a bare function so that
 * `InstanceType<typeof Component>['$props']` keeps working and `vue-tsc` resolves slots
 * and emits in templates exactly as it does for an SFC.
 */
export type MantineComponent<Payload extends FactoryPayload> = {
  new (...args: any[]): {
    $props: FactoryComponentProps<Payload> & RootRefProps<Payload['ref']>
    $slots: Payload['slots']
    /** A function, like Vue's own `$emit` -- not the payload's `emits` map. */
    $emit: EmitFn<Payload['emits']>
  } & (Payload['exposed'] extends Record<string, any> ? Payload['exposed'] : EmptyProps)
} & MantineComponentStaticProperties<Payload>

export function identity<T>(value: T): T {
  return value
}

/**
 * Wraps a component so caller props override a fixed set of props. The wrapper declares no props
 * of its own, so callers' props arrive in `attrs` and are spread last -- that ordering is what
 * gives them precedence.
 */
export function createWithProps(target: Component, statics: Record<string, any>) {
  return (fixedProps: Record<string, any>) => {
    const Extended = defineComponent({
      name: `WithProps(${(target as { name?: string }).name ?? 'Component'})`,
      inheritAttrs: false,
      setup(_props, { attrs, slots }) {
        return () => h(target, { ...fixedProps, ...attrs }, slots)
      },
    })

    Object.assign(Extended, statics, {
      // The returned type also advertises `withProps`, so it must be chainable. Lazy, so this
      // recursion terminates.
      withProps: createWithProps(Extended, statics),
    })

    return Extended
  }
}

/** Assigns the shared static API onto a component implementation. */
export function attachStatics(ui: Component, statics: Record<string, any> | undefined) {
  const target = ui as Component & Record<string, any>
  const assigned = { ...statics }

  Object.assign(target, assigned)
  target.extend = identity
  target.withProps = createWithProps(target, { ...assigned, extend: identity })

  return target
}

/**
 * Attaches the Mantine static API to a component implementation. The implementation stays an
 * ordinary SFC -- only the statics and the exported type change.
 */
export function factory<Payload extends FactoryPayload>(
  ui: Component,
  statics?: Payload['staticComponents'] & {
    classes?: Record<string, string>
    varsResolver?: unknown
  },
) {
  return attachStatics(ui, statics) as unknown as MantineComponent<Payload>
}
