import { readonly, ref, type Ref } from 'vue'

export interface MantineStore<T> {
  value: Readonly<Ref<T>>
  getState: () => T
  setState: (value: T | ((current: T) => T)) => void
  subscribe: (listener: (value: T) => void) => () => void
}

export function createStore<T>(initialState: T): MantineStore<T> {
  const state = ref(initialState) as Ref<T>
  const listeners = new Set<(value: T) => void>()

  const setState = (value: T | ((current: T) => T)) => {
    state.value = typeof value === 'function' ? (value as (current: T) => T)(state.value) : value
    listeners.forEach((listener) => listener(state.value))
  }

  return {
    value: readonly(state) as Readonly<Ref<T>>,
    getState: () => state.value,
    setState,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
