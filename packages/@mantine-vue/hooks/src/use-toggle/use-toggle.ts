import { ref, type Ref } from 'vue'

export type UseToggleReturnValue<T> = [Ref<T>, (value?: T) => void]

export function useToggle<T extends string | boolean = boolean>(
  options: readonly T[] = [false, true] as unknown as readonly T[],
): UseToggleReturnValue<T> {
  const state = ref(options[0]) as Ref<T>
  const toggle = (value?: T) => {
    if (value !== undefined) {
      state.value = value
      return
    }

    const index = options.indexOf(state.value)
    state.value = options[(index + 1) % options.length]
  }

  return [state, toggle]
}
