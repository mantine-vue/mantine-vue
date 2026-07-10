import { ref, type Ref } from 'vue'

export type UseToggleAction<T> = (value?: T | ((value: T) => T)) => void
export type UseToggleReturnValue<T> = [Ref<T>, UseToggleAction<T>]

export function useToggle<T = boolean>(
  options: readonly T[] = [false, true] as unknown as readonly T[],
): UseToggleReturnValue<T> {
  const state = ref(options[0]) as Ref<T>
  const toggle: UseToggleAction<T> = (value) => {
    if (value !== undefined) {
      const nextValue = value instanceof Function ? value(state.value) : value
      const index = Math.abs(options.indexOf(nextValue))
      state.value = options[index]
      return
    }

    const index = options.indexOf(state.value)
    state.value = options[(index + 1) % options.length]
  }

  return [state, toggle]
}
