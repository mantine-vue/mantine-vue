<script lang="ts">
import type { Primitive } from '../../core'

/**
 * Removes the already selected values from the option tree, keeping the groups intact so
 * an emptied group disappears with its heading.
 */
function filterPicked(data: any[], values: Primitive[]): any[] {
  return data
    .map((item) => ('group' in item ? { ...item, items: filterPicked(item.items, values) } : item))
    .filter((item) => 'group' in item || !values.includes(item.value))
}

export { filterPicked }
</script>

<script setup lang="ts">
import { computed, h, nextTick, ref, useAttrs, useSlots, watch, type VNodeChild } from 'vue'
import {
  Combobox,
  ComboboxChevron,
  ComboboxClearButton,
  ComboboxDropdownTarget,
  ComboboxEventsTarget,
  ComboboxHiddenInput,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
} from '../Combobox'
import { Pill, PillGroup } from '../Pill'
import { PillsInput, PillsInputField } from '../PillsInput'
import type { MultiSelectProps, MultiSelectSlots } from './MultiSelect.types'

defineOptions({
  name: 'MultiSelect',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MultiSelectProps<any>>(), {
  modelValue: undefined,
  defaultValue: () => [],
  data: () => [],
  maxValues: Infinity,
  searchable: false,
  hidePickedOptions: false,
  searchValue: undefined,
  clearable: false,
  clearSearchOnChange: true,
  hiddenInputValuesDivider: ',',
  nothingFoundMessage: undefined,
  withCheckIcon: true,
  withAlignedLabels: false,
  checkIconPosition: 'left',
  withScrollArea: true,
  dropdownOpened: undefined,
  defaultDropdownOpened: false,
  openOnFocus: true,
  selectFirstOptionOnDropdownOpen: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  'update:searchValue': [value: string]
  'update:dropdownOpened': [opened: boolean]
  change: [value: any[]]
  remove: [value: any]
  clear: []
  'max-values': []
  'dropdown-open': []
  'dropdown-close': []
  'option-submit': [value: any]
}>()

defineSlots<MultiSelectSlots>()

const slots = useSlots()
const attrs = useAttrs()

const parsed = computed(() => getParsedComboboxData(props.data))
const lockup = computed(() => getOptionsLockup(parsed.value))

/**
 * Options that have been selected at some point are remembered, so a pill keeps its
 * label even if the option later disappears from `data`.
 */
const retained: Record<string, any> = {}

const internal = ref<any[]>([...props.defaultValue])

const current = () => props.modelValue ?? internal.value
const controlled = () => props.modelValue !== undefined

const searchInternal = ref(props.defaultSearchValue ?? '')
const search = () => props.searchValue ?? searchInternal.value

function setSearch(value: string) {
  if (props.searchValue === undefined) {
    searchInternal.value = value
  }

  props.onSearchChange?.(value)
  emit('update:searchValue', value)
  combobox.resetSelectedOption()
}

function setValue(value: any[]) {
  if (!controlled()) {
    internal.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)
}

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  defaultOpened: props.defaultDropdownOpened,
  onDropdownOpen: () => {
    emit('update:dropdownOpened', true)
    emit('dropdown-open')

    // The options only exist after the dropdown has rendered.
    if (props.selectFirstOptionOnDropdownOpen) {
      nextTick(combobox.selectFirstOption)
    }
  },
  onDropdownClose: () => {
    emit('update:dropdownOpened', false)
    emit('dropdown-close')
    combobox.resetSelectedOption()
  },
})

watch(
  [() => current(), lockup],
  () =>
    current().forEach((item: any) => {
      if (lockup.value[String(item)]) {
        retained[String(item)] = lockup.value[String(item)]
      }
    }),
  { immediate: true },
)

function remove(item: any) {
  setValue(current().filter((value: any) => value !== item))
  emit('remove', item)
}

const disabled = computed(() => !!(attrs as any).disabled)
const readOnly = computed(() => !!(attrs as any).readOnly)

const values = computed(() => current())

const canClear = computed(
  () => props.clearable && values.value.length > 0 && !disabled.value && !readOnly.value,
)

function onClear(event: MouseEvent) {
  // The clear button lives inside the input, whose click toggles the dropdown.
  event.stopPropagation()
  setValue([])
  setSearch('')
  emit('clear')
}

/** The clear button replaces the right section entirely, chevron included. */
const rightSection = computed(() =>
  canClear.value
    ? h(ComboboxClearButton, { ...(attrs as any).clearButtonProps, onClick: onClear })
    : ((attrs as any).rightSection ??
      h(ComboboxChevron, { size: (attrs as any).size ?? 'sm', error: (attrs as any).error })),
)

const options = computed(() =>
  props.hidePickedOptions ? filterPicked(parsed.value as any, values.value) : parsed.value,
)

/**
 * These are consumed here – by the hidden input, the right section or the field – so
 * they must not also reach `PillsInput` through the fallthrough attributes.
 */
const forwarded = computed(() => {
  const result: any = { ...attrs }
  ;['name', 'form', 'rightSection', 'clearButtonProps', 'placeholder'].forEach(
    (key) => delete result[key],
  )
  return result
})

const comboboxSize = computed(() => (attrs as any).size ?? 'sm')

function onOptionSubmit(raw: string) {
  const option = lockup.value[raw]

  if (!option) {
    return
  }

  emit('option-submit', option.value)

  // Submitting an already selected option removes it, which is how the dropdown doubles
  // as a toggle list.
  if (values.value.includes(option.value)) {
    remove(option.value)
  } else if (values.value.length >= props.maxValues) {
    emit('max-values')
  } else {
    setValue([...values.value, option.value])
  }

  if (props.clearSearchOnChange) {
    setSearch('')
  }
}

function onInputClick() {
  // A searchable input only opens on click; a plain one toggles, so a second click closes.
  if (props.searchable) {
    combobox.openDropdown()
  } else {
    combobox.toggleDropdown()
  }
}

function onFieldInput(event: Event) {
  setSearch((event.target as HTMLInputElement).value)
  combobox.openDropdown()
}

function onFieldFocus(event: FocusEvent) {
  if (props.openOnFocus && props.searchable) {
    combobox.openDropdown()
  }

  ;(attrs as any).onFocus?.(event)
}

function onFieldBlur(event: FocusEvent) {
  combobox.closeDropdown()
  ;(attrs as any).onBlur?.(event)
}

function onFieldKeydown(event: KeyboardEvent) {
  // Without a search field there is nothing to type, so Space toggles the dropdown.
  if (event.key === ' ' && !props.searchable) {
    event.preventDefault()
    combobox.toggleDropdown()
  }

  // Backspace on an empty search removes the last pill.
  if (event.key === 'Backspace' && !search() && values.value.length && !readOnly.value) {
    remove(values.value[values.value.length - 1])
  }

  ;(attrs as any).onKeydown?.(event)
}

/** Falls back to a synthetic option so an unknown value still renders a pill. */
function optionFor(item: any) {
  return (
    lockup.value[String(item)] ?? retained[String(item)] ?? { value: item, label: String(item) }
  )
}

/** The slot takes precedence over the prop. */
const customPill = computed(() => slots.renderPill ?? props.renderPill)

const renderPill = (item: any): VNodeChild =>
  customPill.value?.({
    option: optionFor(item),
    value: item,
    onRemove: () => remove(item),
    disabled: disabled.value,
  })

/** The placeholder is only shown while nothing is selected, so pills are not covered. */
const fieldPlaceholder = computed(() =>
  values.value.length === 0 ? (attrs as any).placeholder : undefined,
)

const hiddenWhenEmpty = computed(
  () => props.nothingFoundMessage == null && !slots.nothingFoundMessage && !slots.nothingFound,
)
</script>

<template>
  <Combobox
    v-bind="props.comboboxProps"
    :store="combobox"
    :read-only="readOnly"
    :size="comboboxSize"
    __static-selector="MultiSelect"
    @option-submit="onOptionSubmit"
  >
    <ComboboxDropdownTarget>
      <PillsInput
        v-bind="forwarded"
        __static-selector="MultiSelect"
        :disabled="disabled"
        :right-section="rightSection"
        :right-section-pointer-events="canClear ? 'all' : 'none'"
        @click="onInputClick"
      >
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>

        <PillGroup>
          <template v-for="(item, index) in values" :key="`${String(item)}-${index}`">
            <component :is="() => renderPill(item)" v-if="customPill" />
            <Pill
              v-else
              :with-remove-button="!readOnly && !optionFor(item).disabled"
              :disabled="disabled"
              @remove="() => remove(item)"
            >
              {{ optionFor(item).label }}
            </Pill>
          </template>

          <ComboboxEventsTarget :with-expanded-attribute="true">
            <!--
              `PillsInput.Field` has to be the direct child: `Combobox.EventsTarget`
              clones the child vnode to inject the combobox handlers.
            -->
            <PillsInputField
              :model-value="search()"
              :readonly="!props.searchable || readOnly"
              :disabled="disabled"
              :placeholder="fieldPlaceholder"
              @input="onFieldInput"
              @focus="onFieldFocus"
              @blur="onFieldBlur"
              @keydown="onFieldKeydown"
            />
          </ComboboxEventsTarget>
        </PillGroup>
      </PillsInput>
    </ComboboxDropdownTarget>

    <OptionsDropdown
      :data="options as any"
      :hidden="disabled || readOnly"
      :search="search()"
      :filter="props.filter"
      :limit="props.limit"
      :filter-options="props.searchable"
      :hidden-when-empty="hiddenWhenEmpty"
      :nothing-found-message="props.nothingFoundMessage"
      :value="values"
      :with-check-icon="props.withCheckIcon"
      :with-aligned-labels="props.withAlignedLabels"
      :check-icon-position="props.checkIconPosition"
      :with-scroll-area="props.withScrollArea"
      :max-dropdown-height="props.maxDropdownHeight"
      :render-option="props.renderOption"
      :scroll-area-props="props.scrollAreaProps"
    >
      <template v-if="slots.renderOption" #renderOption="scope">
        <slot name="renderOption" v-bind="scope" />
      </template>
      <template v-if="slots.nothingFoundMessage || slots.nothingFound" #nothingFound>
        <slot v-if="slots.nothingFoundMessage" name="nothingFoundMessage" />
        <slot v-else name="nothingFound" />
      </template>
    </OptionsDropdown>
  </Combobox>

  <ComboboxHiddenInput
    v-bind="props.hiddenInputProps"
    :value="values"
    :values-divider="props.hiddenInputValuesDivider"
    :name="(attrs as any).name"
    :form="(attrs as any).form"
    :disabled="disabled"
  />
</template>
