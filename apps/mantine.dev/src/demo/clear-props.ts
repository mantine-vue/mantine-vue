import type { ConfiguratorControlOptions } from './types'

// Removes props whose current value equals the library default, so generated
// code only shows props the user actually changed.
export function clearProps(
  controls: ConfiguratorControlOptions[],
  state: Record<string, unknown>,
): Record<string, unknown> {
  const defaults = controls.reduce<Record<string, unknown>>((acc, c) => {
    acc[c.prop] = c.libraryValue
    return acc
  }, {})

  return Object.keys(state).reduce<Record<string, unknown>>((acc, key) => {
    if (state[key] !== defaults[key]) {
      acc[key] = state[key]
    }
    return acc
  }, {})
}
