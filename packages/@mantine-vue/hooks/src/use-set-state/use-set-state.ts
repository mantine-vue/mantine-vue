import { ref, type Ref } from 'vue'

export type UseSetStateCallback<T> = (state: Partial<T> | ((currentState: T) => Partial<T>)) => void

export type UseSetStateReturnValue<T> = [Ref<T>, UseSetStateCallback<T>]

export function useSetState<T extends Record<string, any>>(
  initialState: T,
): UseSetStateReturnValue<T> {
  const state = ref(initialState) as Ref<T>

  const setState: UseSetStateCallback<T> = (statePartial) => {
    state.value = {
      ...state.value,
      ...(typeof statePartial === 'function' ? statePartial(state.value) : statePartial),
    }
  }

  return [state, setState]
}
