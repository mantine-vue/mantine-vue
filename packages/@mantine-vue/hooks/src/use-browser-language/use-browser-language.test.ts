import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useBrowserLanguage, usePreferredLanguages } from './use-browser-language'

function setLanguage(language: string) {
  Object.defineProperty(window.navigator, 'language', { value: language, configurable: true })
}

function setLanguages(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true })
}

function renderHook<T>(hook: () => T) {
  let result!: T
  const wrapper = mount(
    defineComponent({
      setup() {
        result = hook()
        return () => null
      },
    }),
  )
  return { result, unmount: () => wrapper.unmount() }
}

const dispatchLanguageChange = () => window.dispatchEvent(new Event('languagechange'))

describe('@mantine-vue/hooks/use-browser-language', () => {
  it('returns navigator.language after mount', () => {
    setLanguage('en-US')
    const { result } = renderHook(() => useBrowserLanguage())
    expect(result.value).toBe('en-US')
  })

  it('updates when the languagechange event is dispatched', () => {
    setLanguage('en-US')
    const { result } = renderHook(() => useBrowserLanguage())
    expect(result.value).toBe('en-US')

    setLanguage('fr-FR')
    dispatchLanguageChange()
    expect(result.value).toBe('fr-FR')
  })

  it('removes the languagechange listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useBrowserLanguage())
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('languagechange', expect.any(Function))
    removeSpy.mockRestore()
  })
})

describe('@mantine-vue/hooks/use-preferred-languages', () => {
  it('returns navigator.languages after mount', () => {
    setLanguages(['en-US', 'en'])
    const { result } = renderHook(() => usePreferredLanguages())
    expect(result.value).toEqual(['en-US', 'en'])
  })

  it('updates when the languagechange event is dispatched', () => {
    setLanguages(['en-US', 'en'])
    const { result } = renderHook(() => usePreferredLanguages())

    setLanguages(['fr-FR', 'fr', 'en'])
    dispatchLanguageChange()
    expect(result.value).toEqual(['fr-FR', 'fr', 'en'])
  })

  it('removes the languagechange listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => usePreferredLanguages())
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('languagechange', expect.any(Function))
    removeSpy.mockRestore()
  })
})
