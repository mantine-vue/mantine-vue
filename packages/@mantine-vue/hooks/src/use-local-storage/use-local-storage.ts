import {
  createStorage,
  readValue,
  type UseStorageOptions,
  type UseStorageReturnValue,
} from './create-storage'

export function readLocalStorageValue<T>(options: UseStorageOptions<T>): T {
  return readValue('localStorage')<T>(options)
}

export function useLocalStorage<T>(options: UseStorageOptions<T>): UseStorageReturnValue<T> {
  return createStorage<T>('localStorage', 'use-local-storage')(options)
}
