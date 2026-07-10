import { ref, type Ref } from 'vue'

export interface UseCounterOptions {
  min?: number
  max?: number
}

export interface UseCounterHandlers {
  increment: () => void
  decrement: () => void
  set: (value: number | ((current: number) => number)) => void
  reset: () => void
}

export type UseCounterReturnValue = [Ref<number>, UseCounterHandlers]

export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {},
): UseCounterReturnValue {
  const count = ref(initialValue)
  const clamp = (value: number) =>
    Math.min(options.max ?? value, Math.max(options.min ?? value, value))
  const set = (value: number | ((current: number) => number)) => {
    count.value = clamp(typeof value === 'function' ? value(count.value) : value)
  }

  return [
    count,
    {
      increment: () => set((value) => value + 1),
      decrement: () => set((value) => value - 1),
      set,
      reset: () => set(initialValue),
    },
  ]
}
