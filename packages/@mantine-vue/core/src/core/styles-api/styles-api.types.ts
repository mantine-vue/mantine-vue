import type { CSSProperties } from 'vue'
import type { FactoryPayload } from '../factory/factory-payload'
import type {
  FactoryClassNames,
  FactoryPartialVarsResolver,
  FactoryStyles,
} from '../factory/factory-styles-api'
import type { MantineTheme } from '../MantineProvider'

/**
 * Pre-payload form, where the type argument is a component's *props* interface and the record is
 * unkeyed.
 *
 * Kept so components can move to payloads one at a time: the types below select this form unless
 * the argument is an actual `FactoryPayload`. Only payload interfaces declare a `props` member,
 * which is what makes that discrimination reliable.
 *
 * @deprecated Pass a `*Factory` payload instead, which keys these records by `stylesNames`.
 */
export type LegacyClassNames<Payload = any> =
  | Record<string, string>
  | ((theme: MantineTheme, payload: Payload) => Record<string, string>)

/** @deprecated See {@link LegacyClassNames}. */
export type LegacyStyles<Payload = any> =
  | Record<string, CSSProperties>
  | ((theme: MantineTheme, payload: Payload) => Record<string, CSSProperties>)

/** @deprecated See {@link LegacyClassNames}. */
export type LegacyVars<Payload = any> =
  | Record<string, Record<string, string | undefined>>
  | ((theme: MantineTheme, payload: Payload) => Record<string, Record<string, string | undefined>>)

/**
 * Selects the payload-keyed form for a `FactoryPayload` and the legacy form otherwise.
 *
 * `any` is special-cased first, and the check is wrapped in a tuple, because a naked conditional
 * distributes over `any` and would yield *both* branches as a union -- which is not assignable to
 * either one, breaking every component that forwards `classNames` to a child.
 */
type IsAnyType<T> = 0 extends 1 & T ? true : false

type SelectStylesApi<Payload, Keyed, Legacy> =
  IsAnyType<Payload> extends true ? Legacy : [Payload] extends [FactoryPayload] ? Keyed : Legacy

export type ClassNames<Payload = any> = SelectStylesApi<
  Payload,
  FactoryClassNames<Payload & FactoryPayload>,
  LegacyClassNames<Payload>
>

export type Styles<Payload = any> = SelectStylesApi<
  Payload,
  FactoryStyles<Payload & FactoryPayload>,
  LegacyStyles<Payload>
>

export type Vars<Payload = any> = SelectStylesApi<
  Payload,
  FactoryPartialVarsResolver<Payload & FactoryPayload>,
  LegacyVars<Payload>
>

/**
 * Styles API props shared by every Mantine Vue component.
 *
 */
export interface StylesApiProps<Payload = any> {
  /**
   * Classes added to the component elements, key is a style name, value is a
   * class name. Can be a function that receives the theme and the component
   * props and returns the record.
   */
  classNames?: ClassNames<Payload>

  /**
   * Inline styles added to the component elements, key is a style name, value
   * is a style object. Can be a function that receives the theme and the
   * component props and returns the record.
   */
  styles?: Styles<Payload>

  /**
   * CSS variables added to the component elements, key is a style name, value
   * is a record of CSS variables. Can be a function that receives the theme and
   * the component props and returns the record.
   */
  vars?: Vars<Payload>

  /**
   * If set, all Mantine classes are removed from the component elements. Static
   * classes, class names from `classNames` and CSS variables are still applied.
   * @default false
   */
  unstyled?: boolean
}

export interface UseStylesInput<Payload = any> {
  name: string | (string | undefined)[]
  classes?: Record<string, string>
  props?: Record<string, any>
  stylesCtx?: Record<string, any>
  className?: any
  style?: CSSProperties | CSSProperties[]
  classNames?: LegacyClassNames<Payload>
  styles?: LegacyStyles<Payload>
  vars?: LegacyVars<Payload>
  varsResolver?: (
    theme: MantineTheme,
    props: Record<string, any>,
    ctx: Record<string, any>,
  ) => Record<string, Record<string, string | undefined>>
  rootSelector?: string
  selector?: string
  unstyled?: boolean
  attributes?: Record<string, Record<string, any>>
}
