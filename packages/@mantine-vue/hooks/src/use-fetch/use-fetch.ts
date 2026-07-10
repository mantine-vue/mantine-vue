import { onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

export interface UseFetchOptions extends RequestInit {
  autoInvoke?: boolean
}

export interface UseFetchReturnValue<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => Promise<any>
  abort: () => void
}

export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  { autoInvoke = true, ...options }: UseFetchOptions = {},
): UseFetchReturnValue<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)
  let controller: AbortController | null = null

  const refetch = (): Promise<any> => {
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()

    loading.value = true

    return fetch(toValue(url), { ...options, signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        return res.json()
      })
      .then((res) => {
        data.value = res
        loading.value = false
        return res as T
      })
      .catch((err) => {
        loading.value = false

        if (err.name !== 'AbortError') {
          error.value = err
        }

        return err
      })
  }

  const abort = () => {
    if (controller) {
      controller.abort('')
    }
  }

  watch(
    () => toValue(url),
    () => {
      if (autoInvoke) {
        refetch()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (controller) {
      controller.abort('')
    }
  })

  return { data, loading, error, refetch, abort }
}
