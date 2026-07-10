import { computed, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { useDidUpdate } from '../use-did-update/use-did-update'

export interface UseSelectionInput<T> {
  /** The array of items to select from */
  data: MaybeRefOrGetter<T[]>

  /** The initial selection, empty array by default */
  defaultSelection?: T[]

  /** If true, selection is reset when data changes */
  resetSelectionOnDataChange?: MaybeRefOrGetter<boolean | undefined>
}

export interface UseSelectionHandlers<T> {
  /** Add an item to the selection */
  select: (selected: T) => void

  /** Remove an item from the selection */
  deselect: (deselected: T) => void

  /** Toggle an item's selection state */
  toggle: (toggled: T) => void

  /** Returns true if all items from the `data` are selected */
  isAllSelected: () => boolean

  /** Returns true if at least one item from the `data` is selected */
  isSomeSelected: () => boolean

  /** Set the selection to a specific array of items */
  setSelection: (selection: T[]) => void

  /** Clear all selections */
  resetSelection: () => void
}

export type UseSelectionReturnValue<T> = readonly [Ref<T[]>, UseSelectionHandlers<T>]

export function useSelection<T>(input: UseSelectionInput<T>): UseSelectionReturnValue<T> {
  const selectionSet = ref(new Set<T>(input.defaultSelection || [])) as Ref<Set<T>>

  useDidUpdate(() => {
    if (toValue(input.resetSelectionOnDataChange)) {
      selectionSet.value = new Set()
    }
  }, [input.data, input.resetSelectionOnDataChange])

  const select = (selected: T) => {
    if (!selectionSet.value.has(selected)) {
      const newSet = new Set(selectionSet.value)
      newSet.add(selected)
      selectionSet.value = newSet
    }
  }

  const deselect = (deselected: T) => {
    if (selectionSet.value.has(deselected)) {
      const newSet = new Set(selectionSet.value)
      newSet.delete(deselected)
      selectionSet.value = newSet
    }
  }

  const toggle = (toggled: T) => {
    const newSet = new Set(selectionSet.value)
    if (newSet.has(toggled)) {
      newSet.delete(toggled)
    } else {
      newSet.add(toggled)
    }
    selectionSet.value = newSet
  }

  const resetSelection = () => {
    selectionSet.value = new Set()
  }

  const setSelection = (selection: T[]) => {
    selectionSet.value = new Set(selection)
  }

  const isAllSelected = () => {
    const data = toValue(input.data)
    if (data.length === 0) {
      return false
    }
    return data.every((item) => selectionSet.value.has(item))
  }

  const isSomeSelected = () => {
    const data = toValue(input.data)
    return data.some((item) => selectionSet.value.has(item))
  }

  const selection = computed(() => Array.from(selectionSet.value)) as Ref<T[]>

  return [
    selection,
    {
      select,
      deselect,
      toggle,
      isAllSelected,
      isSomeSelected,
      setSelection,
      resetSelection,
    },
  ] as const
}
