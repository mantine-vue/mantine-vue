import { ref } from 'vue'
import { useComboboxContext } from '../Combobox.context'

export function useComboboxTargetProps(input: {
  targetType?: 'input' | 'button'
  withAriaAttributes?: boolean
  withKeyboardNavigation?: boolean
  withExpandedAttribute?: boolean
  onKeydown?: any
  onClick?: any
  autoComplete?: string
}) {
  const ctx = useComboboxContext()
  const selectedOptionId = ref<string | null>(null)
  const onKeydown = (event: KeyboardEvent) => {
    input.onKeydown?.(event)
    if (ctx.readOnly || input.withKeyboardNavigation === false || event.isComposing) return
    if (event.code === 'ArrowDown' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!ctx.store.dropdownOpened) {
        ctx.store.openDropdown('keyboard')
        selectedOptionId.value = ctx.store.selectActiveOption()
        ctx.store.updateSelectedOptionIndex('selected', { scrollIntoView: true })
      } else selectedOptionId.value = ctx.store.selectNextOption()
    }
    if (event.code === 'ArrowUp' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!ctx.store.dropdownOpened) {
        ctx.store.openDropdown('keyboard')
        selectedOptionId.value = ctx.store.selectActiveOption()
        ctx.store.updateSelectedOptionIndex('selected', { scrollIntoView: true })
      } else selectedOptionId.value = ctx.store.selectPreviousOption()
    }
    if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.key === 'Enter') {
      if ((event as any).keyCode === 229) return
      if (ctx.store.dropdownOpened && ctx.store.getSelectedOptionIndex() !== -1) {
        event.preventDefault()
        ctx.store.clickSelectedOption()
      } else if (input.targetType === 'button') {
        event.preventDefault()
        ctx.store.openDropdown('keyboard')
      }
    }
    if (event.key === 'Escape') ctx.store.closeDropdown('keyboard')
    if ((event.code === 'Space' || event.key === ' ') && input.targetType === 'button') {
      event.preventDefault()
      ctx.store.toggleDropdown('keyboard')
    }
  }
  const onClick = (event: MouseEvent) => {
    if (input.targetType === 'button') (event.currentTarget as HTMLElement).focus()
    input.onClick?.(event)
  }
  return {
    onKeydown,
    onClick,
    get role() {
      return input.withAriaAttributes !== false && input.withExpandedAttribute
        ? 'combobox'
        : undefined
    },
    get 'aria-haspopup'() {
      return input.withAriaAttributes !== false ? 'listbox' : undefined
    },
    get 'aria-expanded'() {
      return input.withAriaAttributes !== false && input.withExpandedAttribute
        ? !!(ctx.store.listId && ctx.store.dropdownOpened)
        : undefined
    },
    get 'aria-controls'() {
      return input.withAriaAttributes !== false && ctx.store.dropdownOpened && ctx.store.listId
        ? ctx.store.listId
        : undefined
    },
    get 'aria-activedescendant'() {
      return input.withAriaAttributes !== false && ctx.store.dropdownOpened
        ? selectedOptionId.value || undefined
        : undefined
    },
    get autoComplete() {
      return input.autoComplete
    },
    get 'data-expanded'() {
      return ctx.store.dropdownOpened || undefined
    },
    get 'data-mantine-stop-propagation'() {
      return ctx.store.dropdownOpened || undefined
    },
  }
}
