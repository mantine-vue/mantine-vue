import ComboboxComponent from './Combobox.vue'
import ComboboxChevronComponent from './ComboboxChevron.vue'
import ComboboxClearButtonComponent from './ComboboxClearButton.vue'
import ComboboxDropdownComponent from './ComboboxDropdown.vue'
import ComboboxDropdownTargetComponent from './ComboboxDropdownTarget.vue'
import ComboboxGroupComponent from './ComboboxGroup.vue'
import ComboboxHiddenInputComponent from './ComboboxHiddenInput.vue'
import ComboboxOptionComponent from './ComboboxOption.vue'
import ComboboxOptionsComponent from './ComboboxOptions.vue'
import ComboboxSearchComponent from './ComboboxSearch.vue'
import { createComboboxSection } from './create-combobox-section'
import { createComboboxTarget } from './create-combobox-target'
import { varsResolver } from './combobox-utils'
import classes from './Combobox.module.css'

/** Anchors the dropdown *and* receives the combobox events. */
export const ComboboxTarget = createComboboxTarget('ComboboxTarget', true)

/** Receives the combobox events without anchoring the dropdown. */
export const ComboboxEventsTarget = createComboboxTarget('ComboboxEventsTarget', false)

export const ComboboxDropdownTarget = ComboboxDropdownTargetComponent
export const ComboboxDropdown = ComboboxDropdownComponent
export const ComboboxOptions = ComboboxOptionsComponent
export const ComboboxOption = ComboboxOptionComponent
export const ComboboxSearch = ComboboxSearchComponent
export const ComboboxGroup = ComboboxGroupComponent
export const ComboboxChevron = ComboboxChevronComponent
export const ComboboxClearButton = ComboboxClearButtonComponent
export const ComboboxHiddenInput = ComboboxHiddenInputComponent

export const ComboboxEmpty = createComboboxSection('ComboboxEmpty', 'empty')
export const ComboboxHeader = createComboboxSection('ComboboxHeader', 'header')
export const ComboboxFooter = createComboboxSection('ComboboxFooter', 'footer')

export const Combobox = Object.assign(ComboboxComponent, {
  classes,
  varsResolver,
  Target: ComboboxTarget,
  EventsTarget: ComboboxEventsTarget,
  DropdownTarget: ComboboxDropdownTarget,
  Dropdown: ComboboxDropdown,
  Options: ComboboxOptions,
  Option: ComboboxOption,
  Search: ComboboxSearch,
  Empty: ComboboxEmpty,
  Header: ComboboxHeader,
  Footer: ComboboxFooter,
  Group: ComboboxGroup,
  Chevron: ComboboxChevron,
  ClearButton: ComboboxClearButton,
  HiddenInput: ComboboxHiddenInput,
})

export type {
  ComboboxChevronProps,
  ComboboxClearButtonProps,
  ComboboxDropdownProps,
  ComboboxDropdownTargetProps,
  ComboboxEmptyProps,
  ComboboxEventsTargetProps,
  ComboboxFooterProps,
  ComboboxGroupProps,
  ComboboxHeaderProps,
  ComboboxHiddenInputProps,
  ComboboxOptionProps,
  ComboboxOptionsProps,
  ComboboxProps,
  ComboboxSearchProps,
  ComboboxSlots,
  ComboboxStylesNames,
  ComboboxTargetProps,
} from './Combobox.types'
