import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useDocumentTitle } from './use-document-title'

function renderHook(title: string) {
  mount(
    defineComponent({
      setup() {
        useDocumentTitle(title)
        return () => null
      },
    }),
  )
}

describe('@mantine-vue/hooks/use-document-title', () => {
  afterEach(() => {
    document.title = ''
  })

  it('sets given value as document.title', () => {
    renderHook('test-title')
    expect(document.title).toBe('test-title')
  })

  it('does not change document.title if called with empty string', () => {
    document.title = 'test-title'
    renderHook('')
    expect(document.title).toBe('test-title')
    renderHook('  \t\n')
    expect(document.title).toBe('test-title')
  })

  it('trims value before setting to document.title', () => {
    renderHook('  test-title\t\n   ')
    expect(document.title).toBe('test-title')
  })
})
