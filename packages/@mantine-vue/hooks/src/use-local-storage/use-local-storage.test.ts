import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './use-local-storage'

function renderHook<T>(options: Parameters<typeof useLocalStorage<T>>[0]) {
  let result!: ReturnType<typeof useLocalStorage<T>>
  mount(
    defineComponent({
      setup() {
        result = useLocalStorage<T>(options)
        return () => null
      },
    }),
  )

  return result
}

beforeEach(() => {
  localStorage.clear()
})

describe('@mantine-vue/hooks/use-local-storage', () => {
  it('returns defaultValue when storage is empty', () => {
    const [value] = renderHook({ key: 'test', defaultValue: 'default' })
    expect(value.value).toBe('default')
  })

  it('reads an existing value from localStorage on mount', () => {
    localStorage.setItem('test', JSON.stringify('stored'))
    const [value] = renderHook({
      key: 'test',
      defaultValue: 'default',
      getInitialValueInEffect: false,
    })

    expect(value.value).toBe('stored')
  })

  it('writes value to localStorage on set', () => {
    const [value, setValue] = renderHook({ key: 'test', defaultValue: '' })

    setValue('hello')
    expect(localStorage.getItem('test')).toBe(JSON.stringify('hello'))
    expect(value.value).toBe('hello')
  })

  it('supports functional updater', () => {
    const [value, setValue] = renderHook<number>({ key: 'count', defaultValue: 1 })

    setValue((previous) => previous + 1)
    expect(value.value).toBe(2)
  })

  it('removes value from localStorage and resets to defaultValue', () => {
    const [value, setValue, removeValue] = renderHook({ key: 'test', defaultValue: 'default' })

    setValue('set')
    removeValue()
    expect(localStorage.getItem('test')).toBeNull()
    expect(value.value).toBe('default')
  })

  it('serializes and deserializes objects', () => {
    const [value, setValue] = renderHook<{ name: string }>({
      key: 'obj',
      defaultValue: { name: 'init' },
    })

    setValue({ name: 'updated' })
    expect(value.value).toEqual({ name: 'updated' })
    expect(JSON.parse(localStorage.getItem('obj')!)).toEqual({ name: 'updated' })
  })

  it('reacts to a storage event', () => {
    const [value] = renderHook({ key: 'test', defaultValue: 'default' })

    window.dispatchEvent(
      new StorageEvent('storage', {
        storageArea: window.localStorage,
        key: 'test',
        newValue: JSON.stringify('from-other-tab'),
      }),
    )

    expect(value.value).toBe('from-other-tab')
  })

  it('ignores storage events for different keys', () => {
    const [value] = renderHook({ key: 'mine', defaultValue: 'original' })

    window.dispatchEvent(
      new StorageEvent('storage', {
        storageArea: window.localStorage,
        key: 'other',
        newValue: JSON.stringify('intruder'),
      }),
    )

    expect(value.value).toBe('original')
  })
})
