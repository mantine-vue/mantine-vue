import { reactive } from 'vue'

export function useMap<T, V>(initialState?: [T, V][]): Map<T, V> {
  return reactive(new Map<T, V>(initialState)) as Map<T, V>
}
