import { describe, expect, it } from 'vitest'
import {
  convertCssVariables,
  defaultCssVariablesResolver,
  DEFAULT_THEME,
  mergeMantineTheme,
} from '../MantineProvider'

describe('@mantine-vue/core theme foundation', () => {
  it('merges theme overrides and propagates font family to headings', () => {
    const theme = mergeMantineTheme(DEFAULT_THEME, { fontFamily: 'Inter' })
    expect(theme.fontFamily).toBe('Inter')
    expect(theme.headings.fontFamily).toBe('Inter')
  })

  it('resolves css variables independently of components', () => {
    const variables = defaultCssVariablesResolver(DEFAULT_THEME)
    const css = convertCssVariables(variables, ':root')

    expect(css).toContain('--mantine-primary-color-filled')
    expect(css).toContain('[data-mantine-color-scheme="dark"]')
  })
})
