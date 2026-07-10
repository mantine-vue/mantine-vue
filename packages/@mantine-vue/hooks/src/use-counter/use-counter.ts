import { ref, type Ref } from 'vue'

export interface UseCounterOptions {
  min?: number
  max?: number
  step?: number
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
  const step = Math.abs(options.step ?? 1)
  const clamp = (value: number) =>
    Math.min(options.max ?? value, Math.max(options.min ?? value, value))
  const count = ref(clamp(initialValue))
  const set = (value: number | ((current: number) => number)) => {
    count.value = clamp(typeof value === 'function' ? value(count.value) : value)
  }

  return [
    count,
    {
      increment: () => set((value) => value + step),
      decrement: () => set((value) => value - step),
      set,
      reset: () => set(initialValue),
    },
  ]
}
