import { describe, expect, it } from 'vitest'
import { useInputState } from './use-input-state'

const changeEventText = {
  currentTarget: { type: 'text', value: 'test-text-value' },
  nativeEvent: {},
} as any

const changeEventBoolean = {
  currentTarget: { type: 'checkbox', checked: true },
  nativeEvent: {},
} as any

describe('@mantine-vue/hooks/use-input-state', () => {
  it('sets correct initial state', () => {
    const [value] = useInputState('test-value')
    expect(value.value).toBe('test-value')
  })

  it('sets value with change event on text input', () => {
    const [value, setValue] = useInputState('')
    setValue(changeEventText)
    expect(value.value).toBe(changeEventText.currentTarget.value)
  })

  it('sets value with change event on boolean input', () => {
    const [value, setValue] = useInputState(false)
    setValue(changeEventBoolean)
    expect(value.value).toBe(true)
  })

  it('sets value when onChange is called with actual value', () => {
    const [booleanValue, setBoolean] = useInputState(false)
    const [stringValue, setString] = useInputState('')

    setBoolean(true)
    setString('test')

    expect(booleanValue.value).toBe(true)
    expect(stringValue.value).toBe('test')
  })

  it('sets value with a callback function', () => {
    const [value, setValue] = useInputState(10)

    setValue((current) => current + 11)
    expect(value.value).toBe(21)
  })
})
