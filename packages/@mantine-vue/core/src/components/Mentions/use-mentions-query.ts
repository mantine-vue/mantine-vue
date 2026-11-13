import { computed, onBeforeUnmount, shallowRef, watch, type ComputedRef } from 'vue'
import type { MentionDataFn, MentionItem, MentionResult, MentionsFilter } from './Mentions.types'
import type { ResolvedMentionSource } from './resolve-sources'

export interface MentionsQueryState {
  items: MentionItem[]
  loading: boolean
  error: unknown
  generation: number
}

interface AsyncQueryState extends MentionsQueryState {
  sourceIndex: number
  query: string | null
}

const EMPTY_STATE: MentionsQueryState = { items: [], loading: false, error: null, generation: 0 }
const LOADING_STATE: MentionsQueryState = {
  items: [],
  loading: true,
  error: null,
  generation: 0,
}
const EMPTY_ASYNC_STATE: AsyncQueryState = { ...EMPTY_STATE, sourceIndex: -1, query: null }

function deburr(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function normalizeMatchText(value: string, ignoreAccents?: boolean): string {
  return (ignoreAccents ? deburr(value) : value).toLowerCase()
}

function defaultFilter(
  { query, items }: { query: string; items: MentionItem[] },
  ignoreAccents?: boolean,
): MentionItem[] {
  const normalize = (value: string) => normalizeMatchText(value, ignoreAccents)
  const normalizedQuery = normalize(query).trim()
  if (normalizedQuery.length === 0) {
    return items
  }
  return items.filter((item) => normalize(item.display ?? item.id).includes(normalizedQuery))
}

function resolveResult(result: MentionResult): MentionItem[] {
  return Array.isArray(result) ? result : result.items
}

function capItems(items: MentionItem[], maxSuggestions?: number): MentionItem[] {
  return maxSuggestions === undefined ? items : items.slice(0, maxSuggestions)
}

export interface UseMentionsQueryInput {
  source: () => ResolvedMentionSource | null
  query: () => string | null
  enabled: () => boolean
  filter: () => false | MentionsFilter | undefined
}

/** Resolves suggestions of the active source for the current query, supports sync and async data */
export function useMentionsQuery({
  source,
  query,
  enabled,
  filter,
}: UseMentionsQueryInput): ComputedRef<MentionsQueryState> {
  const asyncState = shallowRef<AsyncQueryState>(EMPTY_ASYNC_STATE)
  let generation = 0
  let cleanup: (() => void) | null = null

  const isFunctionData = () => typeof source()?.props.data === 'function'

  watch(
    () => [
      source()?.sourceIndex ?? -1,
      query(),
      enabled(),
      isFunctionData(),
      source()?.props.maxSuggestions,
      source()?.props.debounceMs ?? 0,
    ],
    () => {
      cleanup?.()
      cleanup = null

      const currentQuery = query()
      const currentSource = source()
      const sourceIndex = currentSource?.sourceIndex ?? -1

      if (!enabled() || currentQuery == null || !isFunctionData()) {
        asyncState.value = EMPTY_ASYNC_STATE
        return
      }

      const controller = new AbortController()
      const context = { signal: controller.signal }
      const maxSuggestions = currentSource?.props.maxSuggestions
      const debounceMs = currentSource?.props.debounceMs ?? 0
      let timeout = -1

      const current = asyncState.value
      asyncState.value =
        current.sourceIndex === sourceIndex && current.query === currentQuery
          ? { ...current, loading: true, error: null }
          : { ...LOADING_STATE, sourceIndex, query: currentQuery }

      const run = () => {
        Promise.resolve()
          .then(() => {
            const data = source()?.props.data as MentionDataFn | undefined
            return data ? data(currentQuery, context) : []
          })
          .then((result) => {
            if (!controller.signal.aborted) {
              asyncState.value = {
                items: capItems(resolveResult(result), maxSuggestions),
                loading: false,
                error: null,
                generation: ++generation,
                sourceIndex,
                query: currentQuery,
              }
            }
          })
          .catch((error) => {
            if (!controller.signal.aborted) {
              asyncState.value = {
                items: [],
                loading: false,
                error,
                generation: ++generation,
                sourceIndex,
                query: currentQuery,
              }
            }
          })
      }

      if (debounceMs > 0) {
        timeout = window.setTimeout(run, debounceMs)
      } else {
        run()
      }

      cleanup = () => {
        controller.abort()
        window.clearTimeout(timeout)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => cleanup?.())

  return computed<MentionsQueryState>(() => {
    const currentSource = source()
    const currentQuery = query()

    if (!enabled() || currentQuery == null || !currentSource) {
      return EMPTY_STATE
    }

    if (!isFunctionData()) {
      const data = currentSource.props.data
      const items = data == null ? [] : (data as MentionItem[])
      const currentFilter = filter()
      const filtered =
        currentFilter === false
          ? items
          : currentFilter
            ? currentFilter({ query: currentQuery, items })
            : defaultFilter({ query: currentQuery, items }, currentSource.props.ignoreAccents)
      return {
        items: capItems(filtered, currentSource.props.maxSuggestions),
        loading: false,
        error: null,
        generation: 0,
      }
    }

    const state = asyncState.value
    return state.sourceIndex === currentSource.sourceIndex && state.query === currentQuery
      ? {
          items: state.items,
          loading: state.loading,
          error: state.error,
          generation: state.generation,
        }
      : LOADING_STATE
  })
}
