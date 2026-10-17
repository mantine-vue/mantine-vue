/**
 * Tiny namespaced key/value persistence used by showcases.
 *
 * Stores depend on the `KeyValueStorage` interface instead of `localStorage`
 * directly, so tests can use the in-memory implementation and a production app
 * could swap in IndexedDB, cookies or a server-side profile.
 */
export interface KeyValueStorage {
  get: <T>(key: string, fallback: T) => T
  set: <T>(key: string, value: T) => void
  remove: (key: string) => void
  /** Removes every key in this namespace. */
  clear: () => void
}

interface Envelope<T> {
  v: number
  data: T
}

const SCHEMA_VERSION = 1

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) {
    return fallback
  }

  try {
    const envelope = JSON.parse(raw) as Envelope<T>
    return envelope && envelope.v === SCHEMA_VERSION ? envelope.data : fallback
  } catch {
    return fallback
  }
}

/** `localStorage` backed storage. Fails silently (private mode, quota) and falls back to memory. */
export function createBrowserStorage(namespace: string): KeyValueStorage {
  const memory = createMemoryStorage(namespace)
  const prefix = `${namespace}:`

  const getStore = () => {
    try {
      return typeof window !== 'undefined' ? window.localStorage : undefined
    } catch {
      return undefined
    }
  }

  return {
    get(key, fallback) {
      const store = getStore()
      if (!store) {
        return memory.get(key, fallback)
      }
      try {
        return parse(store.getItem(prefix + key), fallback)
      } catch {
        return memory.get(key, fallback)
      }
    },
    set(key, value) {
      memory.set(key, value)
      try {
        getStore()?.setItem(prefix + key, JSON.stringify({ v: SCHEMA_VERSION, data: value }))
      } catch {
        // Quota exceeded or storage disabled – the in-memory copy keeps the session working.
      }
    },
    remove(key) {
      memory.remove(key)
      try {
        getStore()?.removeItem(prefix + key)
      } catch {
        // ignore
      }
    },
    clear() {
      memory.clear()
      const store = getStore()
      if (!store) {
        return
      }
      try {
        Object.keys(store)
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => store.removeItem(key))
      } catch {
        // ignore
      }
    },
  }
}

export function createMemoryStorage(_namespace = 'memory'): KeyValueStorage {
  const data = new Map<string, string>()

  return {
    get: (key, fallback) => parse(data.get(key) ?? null, fallback),
    set: (key, value) => {
      data.set(key, JSON.stringify({ v: SCHEMA_VERSION, data: value }))
    },
    remove: (key) => {
      data.delete(key)
    },
    clear: () => data.clear(),
  }
}
