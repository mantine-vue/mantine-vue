import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { formatMask, generatePattern, isMaskComplete, unformatMask, useMask } from './use-mask'

function renderHook(options: Parameters<typeof useMask>[0]) {
  let result!: ReturnType<typeof useMask>
  mount(
    defineComponent({
      setup() {
        result = useMask(options)
        return () => null
      },
    }),
  )

  return result
}

describe('@mantine-vue/hooks/use-mask', () => {
  it('returns initial empty state', () => {
    const result = renderHook({ mask: '(999) 999-9999' })

    expect(result.value.value).toBe('')
    expect(result.rawValue.value).toBe('')
    expect(result.isComplete.value).toBe(false)
    expect(typeof result.ref).toBe('function')
    expect(typeof result.reset).toBe('function')
  })

  it('reset clears state and calls onChangeRaw', () => {
    const onChangeRaw = vi.fn()
    const result = renderHook({ mask: '999', onChangeRaw })

    result.reset()
    expect(result.value.value).toBe('')
    expect(result.rawValue.value).toBe('')
    expect(onChangeRaw).toHaveBeenCalledWith('', '')
  })

  it('shows mask when alwaysShowMask is true and input is mounted', () => {
    const input = document.createElement('input')
    const result = renderHook({ mask: '99/99', alwaysShowMask: true, slotChar: '_' })

    result.ref(input)
    expect(input.value).toBe('__/__')
  })

  it('sets aria-invalid when invalid option is true', () => {
    const input = document.createElement('input')
    const result = renderHook({ mask: '999', invalid: true })

    result.ref(input)
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  it('resolves the input element from a Mantine input root', () => {
    const root = document.createElement('div')
    const input = document.createElement('input')
    root.appendChild(input)
    const result = renderHook({ mask: '(999) 999-9999' })

    result.ref(root as unknown as HTMLInputElement)
    input.dispatchEvent(new FocusEvent('focus'))
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))

    expect(input.value).toBe('(1__) ___-____')
    expect(result.value.value).toBe('(1__) ___-____')
    expect(result.rawValue.value).toBe('1')
  })

  it('formats and unformats masked values', () => {
    expect(formatMask('1234567890', { mask: '(999) 999-9999' })).toBe('(123) 456-7890')
    expect(formatMask('1a2b3', { mask: '999' })).toBe('123')
    expect(unformatMask('(123) 456-7890', { mask: '(999) 999-9999' })).toBe('1234567890')
  })

  it('checks completion and generates patterns', () => {
    expect(isMaskComplete('(123) 456-7890', { mask: '(999) 999-9999' })).toBe(true)
    expect(isMaskComplete('(123) 456-', { mask: '(999) 999-9999' })).toBe(false)
    expect(generatePattern('full', { mask: '(999)' })).toContain('\\(')
    expect(generatePattern('full-inexact', { mask: '99' })).not.toContain('(')
  })
})
