/* oxlint-disable no-console */
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useWindowEvent } from '../use-window-event/use-window-event'

export type StorageType = 'localStorage' | 'sessionStorage'

export interface UseStorageOptions<T> {
  /** Storage key */
  key: string

  /** Default value that will be set if value is not found in storage */
  defaultValue?: T

  /** If set to true, the real storage value is read after mount rather than during initialization. Default value is true. */
  getInitialValueInEffect?: boolean

  /** Determines whether the value must be synced between browser tabs, `true` by default */
  sync?: boolean

  /** Function to serialize value into string to be saved in storage */
  serialize?: (value: T) => string

  /** Function to deserialize string value from storage to value */
  deserialize?: (value: string | undefined) => T
}

function serializeJSON<T>(value: T, hookName = 'use-local-storage') {
  try {
    return JSON.stringify(value)
  } catch {
    throw new Error(`@mantine-vue/hooks ${hookName}: Failed to serialize the value`)
  }
}

function deserializeJSON(value: string | undefined) {
  try {
    return value && JSON.parse(value)
  } catch {
    return value
  }
}

function createStorageHandler(type: StorageType) {
  const getItem = (key: string) => {
    try {
      return window[type].getItem(key)
    } catch {
      console.warn(`use-local-storage: Failed to get value from storage, ${type} is blocked`)
      return null
    }
  }

  const setItem = (key: string, value: string) => {
    try {
      window[type].setItem(key, value)
    } catch {
      console.warn(`use-local-storage: Failed to set value to storage, ${type} is blocked`)
    }
  }

  const removeItem = (key: string) => {
    try {
      window[type].removeItem(key)
    } catch {
      console.warn(`use-local-storage: Failed to remove value from storage, ${type} is blocked`)
    }
  }

  return { getItem, setItem, removeItem }
}

export type UseStorageReturnValue<T> = [
  Ref<T>, // current value
  (val: T | ((prevState: T) => T)) => void, // callback to set value in storage
  () => void, // callback to remove value from storage
]

export function createStorage<T>(type: StorageType, hookName: string) {
  const eventName =
    type === 'localStorage' ? 'mantine-vue-local-storage' : 'mantine-vue-session-storage'
  const { getItem, setItem, removeItem } = createStorageHandler(type)

  return function useStorage({
    key,
    defaultValue,
    getInitialValueInEffect = true,
    sync = true,
    deserialize = deserializeJSON,
    serialize = (value: T) => serializeJSON(value, hookName),
  }: UseStorageOptions<T>): UseStorageReturnValue<T> {
    const readStorageValue = (skipStorage?: boolean): T => {
      let storageBlockedOrSkipped: boolean

      try {
        storageBlockedOrSkipped =
          typeof window === 'undefined' ||
          !(type in window) ||
          window[type] === null ||
          !!skipStorage
      } catch {
        storageBlockedOrSkipped = true
      }

      if (storageBlockedOrSkipped) {
        return defaultValue as T
      }

      const storageValue = getItem(key)
      return storageValue !== null ? deserialize(storageValue) : (defaultValue as T)
    }

    const value = ref(readStorageValue(getInitialValueInEffect)) as Ref<T>

    const dispatchSyncEvent = (result: T | undefined) => {
      if (typeof window === 'undefined') {
        return
      }
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: result } }))
      })
    }

    const setStorageValue = (val: T | ((prevState: T) => T)) => {
      const result = val instanceof Function ? val(value.value) : val
      setItem(key, serialize(result))
      value.value = result
      dispatchSyncEvent(result)
    }

    const removeStorageValue = () => {
      removeItem(key)
      value.value = defaultValue as T
      dispatchSyncEvent(defaultValue)
    }

    useWindowEvent('storage', (event) => {
      if (sync && event.storageArea === window[type] && event.key === key) {
        value.value = deserialize(event.newValue ?? undefined)
      }
    })

    const handleSyncEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; value: T }>).detail
      if (sync && detail.key === key) {
        value.value = detail.value
      }
    }

    onMounted(() => {
      window.addEventListener(eventName, handleSyncEvent)

      if (defaultValue !== undefined && value.value === undefined) {
        setStorageValue(defaultValue)
      }

      const val = readStorageValue()
      if (val !== undefined) {
        value.value = val
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener(eventName, handleSyncEvent)
    })

    return [value, setStorageValue, removeStorageValue]
  }
}

export function readValue(type: StorageType) {
  const { getItem } = createStorageHandler(type)

  return function read<T>({
    key,
    defaultValue,
    deserialize = deserializeJSON,
  }: UseStorageOptions<T>) {
    let storageBlockedOrSkipped: boolean

    try {
      storageBlockedOrSkipped =
        typeof window === 'undefined' || !(type in window) || window[type] === null
    } catch {
      storageBlockedOrSkipped = true
    }

    if (storageBlockedOrSkipped) {
      return defaultValue as T
    }

    const storageValue = getItem(key)
    return storageValue !== null ? deserialize(storageValue) : (defaultValue as T)
  }
}
