import type { Component } from 'vue'

// See each control's *ControlOptions type in apps/mantine.dev/src/demo/controls.
export type ConfiguratorControl<Type extends string, Params extends Record<string, any>> = {
  type: Type
  prop: string
  libraryValue: unknown
  transformLabel?: boolean
} & Params

export interface SelectDataItem {
  label: string
  value: string
}
export type SelectData = (string | SelectDataItem)[]

export type BooleanControl = ConfiguratorControl<'boolean', { initialValue: boolean }>
export type SegmentedControl = ConfiguratorControl<
  'segmented',
  { data: SelectData; initialValue: string }
>
export type ColorControl = ConfiguratorControl<'color', { initialValue: string }>
export type StringControl = ConfiguratorControl<'string', { initialValue: string }>
export type SelectControl = ConfiguratorControl<
  'select',
  { data: SelectData; initialValue: string }
>
export type SizeControl = ConfiguratorControl<'size', { initialValue: string }>
export type NumberControl = ConfiguratorControl<
  'number',
  { initialValue: number; min?: number; max?: number; step?: number }
>

export type ConfiguratorControlOptions =
  | BooleanControl
  | SegmentedControl
  | ColorControl
  | StringControl
  | SelectControl
  | SizeControl
  | NumberControl

export interface DemoAreaProps {
  centered?: boolean
  withPadding?: boolean
  maxWidth?: number | string
  minHeight?: number | string
  dimmed?: boolean
  striped?: boolean
}

export interface DemoCodeFile {
  fileName?: string
  code: string
  language?: string
}

export type DemoCode = string | DemoCodeFile[]

export interface CodeDemoConfig extends DemoAreaProps {
  type: 'code'
  component: Component
  code: DemoCode
  defaultExpanded?: boolean
}

export interface ConfiguratorDemoConfig extends DemoAreaProps {
  type: 'configurator'
  component: Component
  code: string
  controls: ConfiguratorControlOptions[]
}

// Renders the demo component with a `classNames` prop mapping every selector
// to a class of the same name, plus a sidebar list of selectors - hovering one
// injects an outline style for the matching class and updates the displayed
// code's `{{props}}` placeholder.
export interface StylesApiDemoConfig extends DemoAreaProps {
  type: 'styles-api'
  data: { selectors: Record<string, string> }
  component: Component
  code: string
  defaultExpanded?: boolean
}

export type MantineDemo = CodeDemoConfig | ConfiguratorDemoConfig | StylesApiDemoConfig
