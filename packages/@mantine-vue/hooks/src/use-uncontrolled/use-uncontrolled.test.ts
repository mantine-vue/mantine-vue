import { describe, expect, it, vi } from 'vitest'
import { useUncontrolled } from './use-uncontrolled'

describe('@mantine-vue/hooks/use-uncontrolled', () => {
  it('returns default value for initial uncontrolled state', () => {
    const [value] = useUncontrolled({
      value: undefined,
      defaultValue: 'test-default',
      finalValue: 'test-final',
    })

    expect(value.value).toBe('test-default')
  })

  it('returns final value for initial uncontrolled state if default value was not provided', () => {
    const [value] = useUncontrolled({
      value: undefined,
      defaultValue: undefined,
      finalValue: 'test-final',
    })

    expect(value.value).toBe('test-final')
  })

  it('supports uncontrolled state', () => {
    const [value, setValue, controlled] = useUncontrolled({ defaultValue: 'default-value' })

    expect(controlled.value).toBe(false)
    setValue('change-value')
    expect(value.value).toBe('change-value')
  })

  it('calls onChange with uncontrolled state', () => {
    const spy = vi.fn()
    const [, setValue] = useUncontrolled({ defaultValue: 'default-value', onChange: spy })

    setValue('change-value')
    expect(spy).toHaveBeenCalledWith('change-value')
  })

  it('supports controlled state', () => {
    const spy = vi.fn()
    const [value, setValue, controlled] = useUncontrolled({
      value: 'controlled-value',
      onChange: spy,
    })

    expect(controlled.value).toBe(true)
    setValue('change-value')
    expect(value.value).toBe('controlled-value')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('change-value')
  })
})
