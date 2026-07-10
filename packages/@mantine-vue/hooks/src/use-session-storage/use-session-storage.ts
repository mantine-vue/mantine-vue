import {
  createStorage,
  readValue,
  type UseStorageOptions,
  type UseStorageReturnValue,
} from '../use-local-storage/create-storage'

export function readSessionStorageValue<T>(options: UseStorageOptions<T>): T {
  return readValue('sessionStorage')<T>(options)
}

export function useSessionStorage<T>(options: UseStorageOptions<T>): UseStorageReturnValue<T> {
  return createStorage<T>('sessionStorage', 'use-session-storage')(options)
}
