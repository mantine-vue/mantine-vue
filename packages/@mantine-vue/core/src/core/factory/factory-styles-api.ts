import type { CSSProperties } from 'vue'
import type { MantineTheme } from '../MantineProvider'
import type { FactoryPayload } from './factory-payload'

/** Any CSS custom property name. */
export type CssVariable = `--${string}`

/** The style names a payload declares, or any string when it declares none. */
export type StylesNamesOf<Payload extends FactoryPayload> = Payload['stylesNames'] extends string
  ? Payload['stylesNames']
  : string

export type StylesRecord<StylesNames extends string, Value> = Partial<Record<StylesNames, Value>>

/**
 * A `classNames`/`styles` value keyed by the payload's style names.
 *
 * Compound components resolve to the static record only: they cannot take a function,
 * because they are configured through their parent's Styles API rather than their own.
 *
 */
export type StylesApiRecord<
  Payload extends FactoryPayload,
  Value,
> = Payload['compound'] extends true
  ? StylesRecord<StylesNamesOf<Payload>, Value>
  :
      | StylesRecord<StylesNamesOf<Payload>, Value>
      | ((
          theme: MantineTheme,
          props: Payload['props'],
          ctx: Record<string, any>,
        ) => StylesRecord<StylesNamesOf<Payload>, Value>)

export type FactoryClassNames<Payload extends FactoryPayload> = StylesApiRecord<Payload, string>

export type FactoryStyles<Payload extends FactoryPayload> = StylesApiRecord<Payload, CSSProperties>

/** Maps a payload's `vars` description onto the record a resolver must return. */
export type TransformVars<Vars> = {
  [Key in keyof Vars]: Vars[Key] extends CssVariable ? Record<Vars[Key], string | undefined> : never
}

export type PartialTransformVars<Vars> = {
  [Key in keyof Vars]: Vars[Key] extends CssVariable
    ? Partial<Record<Vars[Key], string | undefined>>
    : never
}

export type FactoryVarsResolver<Payload extends FactoryPayload> = (
  theme: MantineTheme,
  props: Payload['props'],
  ctx: Record<string, any>,
) => TransformVars<Payload['vars']>

export type FactoryPartialVarsResolver<Payload extends FactoryPayload> = (
  theme: MantineTheme,
  props: Payload['props'],
  ctx: Record<string, any>,
) => PartialTransformVars<Payload['vars']>

/**
 * The `vars` prop stays resolver-only, matching upstream.
 *
 * `useStyles` would also accept a plain record, and `classNames`/`styles` do -- but adding the
 * record form here means mapping `Payload['vars']` in a *union* member rather than in a function's
 * return position. Return positions are evaluated lazily; a union member is not, so the components
 * still on the legacy props-keyed form (`vars?: Vars<XProps>` declared inside `XProps`) become
 * circular, and several others blow the instantiation depth limit.
 *
 * Callers needing an arbitrary custom property should bind it through `style`, which is where
 * upstream's `__vars` escape hatch ends up anyway.
 */
