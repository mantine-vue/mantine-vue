import type { Component } from 'vue'
import type { CodeDemoConfig, DemoAreaProps } from './types'

/**
 * Creates a code demo from a single-file component and its raw source
 * (`import code from './Demo.vue?raw'`), so the displayed code is always the code that runs.
 * Name the raw import `<demoName>Code` – the AI docs compiler resolves demo code by that name.
 */
export function createVueDemo(
  component: Component,
  code: string,
  options: DemoAreaProps & { defaultExpanded?: boolean } = {},
): CodeDemoConfig {
  return { type: 'code', component, code: code.trim(), ...options }
}
