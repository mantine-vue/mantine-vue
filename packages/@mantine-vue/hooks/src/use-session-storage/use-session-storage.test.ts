import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStorage } from './use-session-storage'

function renderHook<T>(options: Parameters<typeof useSessionStorage<T>>[0]) {
  let result!: ReturnType<typeof useSessionStorage<T>>
  mount(
    defineComponent({
      setup() {
        result = useSessionStorage<T>(options)
        return () => null
      },
    }),
  )

  return result
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('@mantine-vue/hooks/use-session-storage', () => {
  it('returns defaultValue when storage is empty', () => {
    const [value] = renderHook({ key: 'test', defaultValue: 'default' })
    expect(value.value).toBe('default')
  })

  it('reads an existing value from sessionStorage on mount', () => {
    sessionStorage.setItem('test', JSON.stringify('stored'))
    const [value] = renderHook({
      key: 'test',
      defaultValue: 'default',
      getInitialValueInEffect: false,
    })

    expect(value.value).toBe('stored')
  })

  it('writes value to sessionStorage on set', () => {
    const [value, setValue] = renderHook({ key: 'test', defaultValue: '' })

    setValue('hello')
    expect(sessionStorage.getItem('test')).toBe(JSON.stringify('hello'))
    expect(value.value).toBe('hello')
  })

  it('removes value from sessionStorage and resets to defaultValue', () => {
    const [value, setValue, removeValue] = renderHook({ key: 'test', defaultValue: 'default' })

    setValue('set')
    removeValue()
    expect(sessionStorage.getItem('test')).toBeNull()
    expect(value.value).toBe('default')
  })
})
