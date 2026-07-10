import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export interface UseMediaQueryOptions {
  getInitialValueInEffect?: boolean
}

function getInitialMediaQueryValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === 'boolean') {
    return initialValue
  }

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia(query).matches
  }

  return false
}

export function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  initialValue = false,
  options: UseMediaQueryOptions = { getInitialValueInEffect: true },
): Readonly<Ref<boolean>> {
  const matches = ref(initialValue)
  const instance = getCurrentInstance()
  let mediaQueryList: MediaQueryList | undefined

  const cleanup = () => mediaQueryList?.removeEventListener('change', update)
  const update = (event?: MediaQueryListEvent) => {
    matches.value = event ? event.matches : Boolean(mediaQueryList?.matches)
  }

  if (!options.getInitialValueInEffect) {
    matches.value = getInitialMediaQueryValue(toValue(query), initialValue)
  }

  if (instance) {
    onMounted(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return
      }

      mediaQueryList = window.matchMedia(toValue(query))
      update()
      mediaQueryList.addEventListener('change', update)
    })

    onBeforeUnmount(cleanup)
  }

  watch(
    () => toValue(query),
    () => {
      cleanup()
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        mediaQueryList = window.matchMedia(toValue(query))
        update()
        mediaQueryList.addEventListener('change', update)
      }
    },
  )

  return readonly(matches) as Readonly<Ref<boolean>>
}
