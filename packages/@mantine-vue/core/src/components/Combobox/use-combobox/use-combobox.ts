import { computed, onBeforeUnmount, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export type ComboboxDropdownEventSource = 'keyboard' | 'mouse' | 'unknown'
export interface UseComboboxOptions {
  defaultOpened?: boolean
  opened?: MaybeRefOrGetter<boolean | undefined>
  onOpenedChange?: (opened: boolean) => void
  onDropdownClose?: (source: ComboboxDropdownEventSource) => void
  onDropdownOpen?: (source: ComboboxDropdownEventSource) => void
  loop?: boolean
  scrollBehavior?: ScrollBehavior
}
export interface ComboboxStore {
  readonly dropdownOpened: boolean
  openDropdown: (source?: ComboboxDropdownEventSource) => void
  closeDropdown: (source?: ComboboxDropdownEventSource) => void
  toggleDropdown: (source?: ComboboxDropdownEventSource) => void
  readonly selectedOptionIndex: number
  getSelectedOptionIndex: () => number
  selectOption: (index: number) => string | null
  selectActiveOption: () => string | null
  selectFirstOption: () => string | null
  selectNextOption: () => string | null
  selectPreviousOption: () => string | null
  resetSelectedOption: () => void
  clickSelectedOption: () => void
  updateSelectedOptionIndex: (
    target?: 'active' | 'selected' | number,
    options?: { scrollIntoView?: boolean },
  ) => void
  readonly listId: string | null
  setListId: (id: string) => void
  searchRef: Ref<HTMLInputElement | null>
  focusSearchInput: () => void
  targetRef: Ref<HTMLElement | null>
  focusTarget: () => void
}

export function useCombobox(options: UseComboboxOptions = {}): ComboboxStore {
  const internalOpened = ref(!!options.defaultOpened)
  const opened = computed(() =>
    options.opened === undefined
      ? internalOpened.value
      : (toValue(options.opened) ?? internalOpened.value),
  )
  const listId = ref<string | null>(null)
  const selectedIndex = ref(-1)
  const searchRef = ref<HTMLInputElement | null>(null)
  const targetRef = ref<HTMLElement | null>(null)
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const setOpened = (value: boolean) => {
    if (options.opened === undefined || toValue(options.opened) === undefined)
      internalOpened.value = value
    options.onOpenedChange?.(value)
  }
  const openDropdown = (source: ComboboxDropdownEventSource = 'unknown') => {
    if (!opened.value) {
      setOpened(true)
      options.onDropdownOpen?.(source)
    }
  }
  const closeDropdown = (source: ComboboxDropdownEventSource = 'unknown') => {
    if (opened.value) {
      setOpened(false)
      options.onDropdownClose?.(source)
    }
  }
  const root = (): Document | ShadowRoot | undefined =>
    (targetRef.value?.getRootNode?.() as Document | ShadowRoot | undefined) ??
    (typeof document !== 'undefined' ? document : undefined)
  const list = (): HTMLElement | null => {
    if (!listId.value) return null
    const currentRoot = root()
    return ((currentRoot as any)?.getElementById?.(listId.value) ??
      currentRoot?.querySelector<HTMLElement>(`#${listId.value}`)) as HTMLElement | null
  }
  const items = (): HTMLElement[] =>
    Array.from(list()?.querySelectorAll<HTMLElement>('[data-combobox-option]') ?? [])
  const clearSelected = () =>
    items().forEach((item) => {
      item.removeAttribute('data-combobox-selected')
      item.removeAttribute('aria-selected')
    })
  const selectOption = (index: number) => {
    const optionsList = items()
    if (!optionsList.length) return null
    let next = index >= optionsList.length ? 0 : index < 0 ? optionsList.length - 1 : index
    let attempts = 0
    while (
      optionsList[next]?.hasAttribute('data-combobox-disabled') &&
      attempts < optionsList.length
    ) {
      next =
        (next + (index < selectedIndex.value ? -1 : 1) + optionsList.length) % optionsList.length
      attempts += 1
    }
    if (!optionsList[next] || optionsList[next].hasAttribute('data-combobox-disabled')) return null
    selectedIndex.value = next
    clearSelected()
    optionsList[next].setAttribute('data-combobox-selected', 'true')
    optionsList[next].setAttribute('aria-selected', 'true')
    optionsList[next].scrollIntoView?.({
      block: 'nearest',
      behavior: options.scrollBehavior ?? 'instant',
    })
    return optionsList[next].id
  }
  const enabledIndices = () =>
    items()
      .map((item, index) => (!item.hasAttribute('data-combobox-disabled') ? index : -1))
      .filter((index) => index >= 0)
  const selectNextOption = () => {
    const enabled = enabledIndices()
    if (!enabled.length) return null
    const at = enabled.indexOf(selectedIndex.value)
    const next =
      at === -1
        ? enabled[0]
        : (enabled[at + 1] ?? (options.loop === false ? enabled.at(-1)! : enabled[0]))
    return selectOption(next)
  }
  const selectPreviousOption = () => {
    const enabled = enabledIndices()
    if (!enabled.length) return null
    const at = enabled.indexOf(selectedIndex.value)
    const next =
      at === -1
        ? enabled.at(-1)!
        : (enabled[at - 1] ?? (options.loop === false ? enabled[0] : enabled.at(-1)!))
    return selectOption(next)
  }
  const updateSelectedOptionIndex = (
    target: 'active' | 'selected' | number = 'selected',
    config?: { scrollIntoView?: boolean },
  ) => {
    if (typeof target === 'number') {
      selectedIndex.value = target
      if (config?.scrollIntoView)
        items()[target]?.scrollIntoView?.({
          block: 'nearest',
          behavior: options.scrollBehavior ?? 'instant',
        })
      return
    }
    const timer = setTimeout(() => {
      timers.delete(timer)
      const index = items().findIndex((item) => item.hasAttribute(`data-combobox-${target}`))
      selectedIndex.value = index
      if (config?.scrollIntoView)
        items()[index]?.scrollIntoView?.({
          block: 'nearest',
          behavior: options.scrollBehavior ?? 'instant',
        })
    })
    timers.add(timer)
  }
  const defer = (callback: () => void) => {
    const timer = setTimeout(() => {
      timers.delete(timer)
      callback()
    })
    timers.add(timer)
  }
  onBeforeUnmount(() => timers.forEach(clearTimeout))
  return {
    get dropdownOpened() {
      return opened.value
    },
    openDropdown,
    closeDropdown,
    toggleDropdown: (source = 'unknown') =>
      opened.value ? closeDropdown(source) : openDropdown(source),
    get selectedOptionIndex() {
      return selectedIndex.value
    },
    getSelectedOptionIndex: () => selectedIndex.value,
    selectOption,
    selectActiveOption: () => {
      const index = items().findIndex((item) => item.hasAttribute('data-combobox-active'))
      return selectOption(index < 0 ? 0 : index)
    },
    selectFirstOption: () => {
      const first = enabledIndices()[0]
      return first === undefined ? null : selectOption(first)
    },
    selectNextOption,
    selectPreviousOption,
    resetSelectedOption: () => {
      selectedIndex.value = -1
      clearSelected()
    },
    clickSelectedOption: () => items()[selectedIndex.value]?.click(),
    updateSelectedOptionIndex,
    get listId() {
      return listId.value
    },
    setListId: (id) => (listId.value = id),
    searchRef,
    focusSearchInput: () => defer(() => searchRef.value?.focus()),
    targetRef,
    focusTarget: () => defer(() => targetRef.value?.focus()),
  }
}
