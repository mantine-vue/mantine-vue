import { computed, type MaybeRefOrGetter } from 'vue'
import { useUncontrolled } from '../use-uncontrolled/use-uncontrolled'

export const DOTS = 'dots' as const

export interface UsePaginationOptions {
  total: number
  siblings?: number
  boundaries?: number
  page?: MaybeRefOrGetter<number | undefined>
  initialPage?: number
  onChange?: (page: number) => void
  startValue?: number
}

function range(start: number, end: number) {
  const length = Math.max(end - start + 1, 0)
  return Array.from({ length }, (_, index) => index + start)
}

export function usePagination({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage,
  onChange,
  startValue = 1,
}: UsePaginationOptions) {
  const start = computed(() => Math.max(Math.trunc(startValue), 1))
  const end = computed(() => Math.max(Math.trunc(total), start.value))
  const totalPages = computed(() => end.value - start.value + 1)
  const firstPage = computed(() => initialPage ?? start.value)
  const [active, setActive] = useUncontrolled<number>({
    value: page,
    defaultValue: firstPage.value,
    finalValue: firstPage.value,
    onChange,
  })

  const setPage = (pageNumber: number) => {
    const nextPage = Math.min(end.value, Math.max(start.value, pageNumber))

    if (nextPage !== active.value) {
      setActive(nextPage)
    }
  }

  const paginationRange = computed<(number | typeof DOTS)[]>(() => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2

    if (totalPageNumbers >= totalPages.value) {
      return range(start.value, end.value)
    }

    const leftSiblingIndex = Math.max(active.value - siblings, start.value + boundaries - 1)
    const rightSiblingIndex = Math.min(active.value + siblings, end.value - boundaries)
    const shouldShowLeftDots = leftSiblingIndex > start.value + boundaries + 1
    const shouldShowRightDots = rightSiblingIndex < end.value - boundaries

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2
      return [
        ...range(start.value, start.value + leftItemCount - 1),
        DOTS,
        ...range(end.value - (boundaries - 1), end.value),
      ]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + siblings * 2
      return [
        ...range(start.value, start.value + boundaries - 1),
        DOTS,
        ...range(end.value - rightItemCount, end.value),
      ]
    }

    return [
      ...range(start.value, start.value + boundaries - 1),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(end.value - boundaries + 1, end.value),
    ]
  })

  return {
    range: paginationRange,
    active,
    setPage,
    next: () => setPage(active.value + 1),
    previous: () => setPage(active.value - 1),
    first: () => setPage(start.value),
    last: () => setPage(end.value),
  }
}
