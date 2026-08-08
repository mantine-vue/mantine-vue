import type { CSSProperties } from 'vue'
import type { MantineTheme } from '../MantineProvider'

export type ClassNames<Payload = any> =
  | Record<string, string>
  | ((theme: MantineTheme, payload: Payload) => Record<string, string>)

export type Styles<Payload = any> =
  | Record<string, CSSProperties>
  | ((theme: MantineTheme, payload: Payload) => Record<string, CSSProperties>)

export type Vars<Payload = any> =
  | Record<string, Record<string, string | undefined>>
  | ((theme: MantineTheme, payload: Payload) => Record<string, Record<string, string | undefined>>)

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
  classNames?: ClassNames<Payload>
  styles?: Styles<Payload>
  vars?: Vars<Payload>
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
