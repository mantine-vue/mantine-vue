import { describe, expect, it } from 'vitest'
import { useSetState } from './use-set-state'

const data = {
  a: 1,
  b: 'test',
  c: [1, 2, 3],
}

describe('@mantine-vue/hooks/use-set-state', () => {
  it('returns correct initial state', () => {
    const [state] = useSetState(data)
    expect(state.value).toStrictEqual({ a: 1, b: 'test', c: [1, 2, 3] })
  })

  it('sets state with given state partial', () => {
    const [state, setState] = useSetState(data)

    setState({ a: 2 })
    expect(state.value).toStrictEqual({ ...data, a: 2 })
    setState({ a: 3, b: 'test-2' })
    expect(state.value).toStrictEqual({ ...data, a: 3, b: 'test-2' })
  })

  it('sets state with state function', () => {
    const [state, setState] = useSetState(data)

    setState((current) => ({ a: current.a + 1 }))
    expect(state.value).toStrictEqual({ ...data, a: 2 })
  })
})
