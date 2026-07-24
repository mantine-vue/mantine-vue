import type { CSSProperties, Component, Ref } from 'vue'
import type { MantineTheme, MantineThemeOverride } from './MantineProvider'

export type MantineStyle = CSSProperties
export type AlignItems = CSSProperties['alignItems']
export type JustifyContent = CSSProperties['justifyContent']
export type FlexWrap = CSSProperties['flexWrap']
export type FlexDirection = CSSProperties['flexDirection']
export type Overflow = CSSProperties['overflow']
export type ObjectFit = CSSProperties['objectFit']
export type PointerEvents = CSSProperties['pointerEvents']
export type MantineClassNames = Record<string, string>
export type MantineStyles = Record<string, MantineStyle>
export type MantineVars = Record<string, Record<string, string | undefined>>
export type MantineVariant<T extends string> = T | (string & {})

export interface MantineComponentTheme {
  classNames?: MantineClassNames | ((theme: MantineTheme, props: any) => MantineClassNames)
  styles?: MantineStyles | ((theme: MantineTheme, props: any) => MantineStyles)
  vars?: MantineVars | ((theme: MantineTheme, props: any) => MantineVars)
  defaultProps?: Record<string, any>
}

export interface MantineProviderVNodeProps {
  theme?: MantineThemeOverride
}

export interface MantineVueComponentFactoryPayload<Props = Record<string, any>> {
  name: string
  props?: Props
  render: (payload: { props: Props; ref: Ref<any> }) => any
}

export type MantineVueComponent = Component
