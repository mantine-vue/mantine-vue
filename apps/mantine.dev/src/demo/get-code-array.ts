import { clearProps } from './clear-props'
import { injectProps } from './inject-props'
import type { ConfiguratorControlOptions } from './types'

export function getCode(
  code: string,
  controls: ConfiguratorControlOptions[],
  state: Record<string, unknown>,
): string {
  return injectProps(clearProps(controls, state), code).trim()
}
