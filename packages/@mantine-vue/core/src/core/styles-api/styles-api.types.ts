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

export interface StylesApiProps<Payload = any> {
  classNames?: ClassNames<Payload>
  styles?: Styles<Payload>
  vars?: Vars<Payload>
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
