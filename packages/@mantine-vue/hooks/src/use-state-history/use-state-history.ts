import { computed, readonly, ref, type Ref } from 'vue'

export interface UseStateHistoryHandlers<T> {
  set: (value: T) => void
  back: (steps?: number) => void
  forward: (steps?: number) => void
  reset: () => void
}

export interface UseStateHistoryValue<T> {
  history: T[]
  current: number
}

export type UseStateHistoryReturnValue<T> = [
  Readonly<Ref<T>>,
  UseStateHistoryHandlers<T>,
  Readonly<Ref<UseStateHistoryValue<T>>>,
]

export function useStateHistory<T>(initialValue: T): UseStateHistoryReturnValue<T> {
  const historyState = ref<UseStateHistoryValue<T>>({
    history: [initialValue],
    current: 0,
  }) as Ref<UseStateHistoryValue<T>>

  const set = (val: T) => {
    const nextHistory = [
      ...historyState.value.history.slice(0, historyState.value.current + 1),
      val,
    ]
    historyState.value = {
      history: nextHistory,
      current: nextHistory.length - 1,
    }
  }

  const back = (steps = 1) => {
    historyState.value = {
      history: historyState.value.history,
      current: Math.max(0, historyState.value.current - steps),
    }
  }

  const forward = (steps = 1) => {
    historyState.value = {
      history: historyState.value.history,
      current: Math.min(historyState.value.history.length - 1, historyState.value.current + steps),
    }
  }

  const reset = () => {
    historyState.value = { history: [initialValue], current: 0 }
  }

  const handlers: UseStateHistoryHandlers<T> = { back, forward, reset, set }

  const current = computed(() => historyState.value.history[historyState.value.current])

  return [
    current as Readonly<Ref<T>>,
    handlers,
    readonly(historyState) as Readonly<Ref<UseStateHistoryValue<T>>>,
  ]
}
