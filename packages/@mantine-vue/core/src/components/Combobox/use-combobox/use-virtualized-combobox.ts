import { toValue, type MaybeRefOrGetter } from 'vue'
import { useCombobox, type ComboboxStore, type UseComboboxOptions } from './use-combobox'

export interface UseVirtualizedComboboxOptions extends UseComboboxOptions {
  totalOptionsCount: MaybeRefOrGetter<number>
  isOptionDisabled?: (index: number) => boolean
  getOptionId: (index: number) => string | null
  selectedOptionIndex: MaybeRefOrGetter<number>
  setSelectedOptionIndex: (index: number) => void
  activeOptionIndex?: MaybeRefOrGetter<number | undefined>
  onSelectedOptionSubmit: (index: number) => void
}
export function useVirtualizedCombobox(options: UseVirtualizedComboboxOptions): ComboboxStore {
  const base = useCombobox(options)
  const count = () => toValue(options.totalOptionsCount)
  const selected = () => toValue(options.selectedOptionIndex)
  const disabled = options.isOptionDisabled ?? (() => false)
  const selectOption = (index: number) => {
    if (!count()) {
      options.setSelectedOptionIndex(-1)
      return null
    }
    const next = index >= count() ? 0 : index < 0 ? count() - 1 : index
    if (disabled(next)) return null
    options.setSelectedOptionIndex(next)
    return options.getOptionId(next)
  }
  const seek = (direction: 1 | -1) => {
    if (!count()) return null
    let index = selected()
    for (let attempts = 0; attempts < count(); attempts += 1) {
      index += direction
      if (index < 0) index = options.loop === false ? 0 : count() - 1
      if (index >= count()) index = options.loop === false ? count() - 1 : 0
      if (!disabled(index)) return selectOption(index)
    }
    return null
  }
  return {
    get dropdownOpened() {
      return base.dropdownOpened
    },
    openDropdown: base.openDropdown,
    closeDropdown: base.closeDropdown,
    toggleDropdown: base.toggleDropdown,
    get selectedOptionIndex() {
      return selected()
    },
    getSelectedOptionIndex: selected,
    selectOption,
    selectActiveOption: () => selectOption(toValue(options.activeOptionIndex) ?? 0),
    selectFirstOption: () => {
      for (let index = 0; index < count(); index += 1)
        if (!disabled(index)) return selectOption(index)
      return null
    },
    selectNextOption: () => seek(1),
    selectPreviousOption: () => seek(-1),
    resetSelectedOption: () => options.setSelectedOptionIndex(-1),
    clickSelectedOption: () => {
      const index = selected()
      if (index >= 0 && index < count() && !disabled(index)) options.onSelectedOptionSubmit(index)
    },
    updateSelectedOptionIndex: (target = 'selected') => {
      if (typeof target === 'number') options.setSelectedOptionIndex(target)
      else if (target === 'active' && toValue(options.activeOptionIndex) !== undefined)
        options.setSelectedOptionIndex(toValue(options.activeOptionIndex)!)
    },
    get listId() {
      return base.listId
    },
    setListId: base.setListId,
    searchRef: base.searchRef,
    focusSearchInput: base.focusSearchInput,
    targetRef: base.targetRef,
    focusTarget: base.focusTarget,
  }
}
