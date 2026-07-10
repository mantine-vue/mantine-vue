import { describe, expect, it } from 'vitest'
import { useValidatedState } from './use-validated-state'

describe('@mantine-vue/hooks/use-validated-state', () => {
  it('returns initial value', () => {
    const [validState, setValid] = useValidatedState('test', (value) => value === 'test')
    expect(validState.value.lastValidValue).toBe('test')
    expect(validState.value.valid).toBe(true)
    expect(validState.value.value).toBe('test')
    expect(typeof setValid).toBe('function')

    const [invalidState, setInvalid] = useValidatedState('test', (value) => value === 'tests')
    expect(invalidState.value.lastValidValue).toBeUndefined()
    expect(invalidState.value.valid).toBe(false)
    expect(invalidState.value.value).toBe('test')
    expect(typeof setInvalid).toBe('function')
  })

  it('respects initialValidationState to override validator result on initial render', () => {
    const [invalidState] = useValidatedState('test', (value) => value === 'other', false)
    const [forcedState] = useValidatedState('test', (value) => value === 'other', true)

    expect(invalidState.value.valid).toBe(false)
    expect(forcedState.value.valid).toBe(true)
  })

  it('updates lastValidValue when a valid value is set after invalid ones', () => {
    const [state, setValue] = useValidatedState('start', (value) => value.length > 3)

    setValue('no')
    expect(state.value.valid).toBe(false)
    expect(state.value.lastValidValue).toBe('start')
    setValue('valid-again')
    expect(state.value.valid).toBe(true)
    expect(state.value.lastValidValue).toBe('valid-again')
  })

  it('keeps lastValidValue from before a streak of invalid values', () => {
    const [state, setValue] = useValidatedState('good', (value) => value === 'good')

    setValue('bad1')
    setValue('bad2')
    expect(state.value.lastValidValue).toBe('good')
  })
})
