<script setup lang="ts">
import { computed, h, nextTick, ref, useAttrs, useSlots, watch } from 'vue'
import { useId } from '@mantine-vue/hooks'
import {
  Combobox,
  ComboboxChevron,
  ComboboxClearButton,
  ComboboxHiddenInput,
  ComboboxTarget,
  OptionsDropdown,
  getOptionsLockup,
  getParsedComboboxData,
  useCombobox,
  type ComboboxItem,
} from '../Combobox'
import { InputBase } from '../InputBase'
import type { SelectEmits, SelectProps, SelectSlots } from './Select.types'

defineOptions({
  name: 'Select',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps<any>>(), {
  modelValue: undefined,
  defaultValue: null,
  data: () => [],
  searchable: false,
  searchValue: undefined,
  allowDeselect: true,
  clearable: false,
  withCheckIcon: true,
  withAlignedLabels: false,
  checkIconPosition: 'left',
  nothingFoundMessage: undefined,
  dropdownOpened: undefined,
  defaultDropdownOpened: false,
  selectFirstOptionOnChange: false,
  selectFirstOptionOnDropdownOpen: false,
  withScrollArea: true,
  autoSelectOnBlur: false,
  openOnFocus: true,
  clearSectionMode: undefined,
  chevronColor: undefined,
})

const emit = defineEmits<SelectEmits<any>>()

defineSlots<SelectSlots>()

const slots = useSlots()
const attrs = useAttrs()

const parsed = computed(() => getParsedComboboxData(props.data))
const lockup = computed(() => getOptionsLockup(parsed.value))

/**
 * Options that have been selected at some point are remembered, so the input keeps
 * showing a label even if the option later disappears from `data` – which happens
 * routinely with async data.
 */
const retained: Record<string, ComboboxItem<any>> = {}

const internal = ref(props.defaultValue)

const controlled = () => props.modelValue !== undefined
const current = () => (props.modelValue !== undefined ? props.modelValue : internal.value)

const selected = computed(() =>
  current() != null ? (lockup.value[String(current())] ?? retained[String(current())]) : undefined,
)

const internalSearch = ref(props.defaultSearchValue ?? selected.value?.label ?? '')

const searchControlled = () => props.searchValue !== undefined
const search = () => props.searchValue ?? internalSearch.value

function setSearch(value: string) {
  if (!searchControlled()) {
    internalSearch.value = value
  }

  emit('search-change', value)
  emit('update:searchValue', value)
  combobox.resetSelectedOption()
}

function changeValue(value: any, option: ComboboxItem<any> | null) {
  if (!controlled()) {
    internal.value = value
  }

  emit('update:modelValue', value)
  emit('change', value, option)
}

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  defaultOpened: props.defaultDropdownOpened,
  onDropdownOpen: () => {
    emit('dropdown-open')

    // The options only exist after the dropdown has rendered. By default the currently
    // selected option is highlighted and scrolled to, not the first one.
    nextTick(() =>
      props.selectFirstOptionOnDropdownOpen
        ? combobox.selectFirstOption()
        : combobox.updateSelectedOptionIndex('active', { scrollIntoView: true }),
    )
  },
  onDropdownClose: () => {
    emit('dropdown-close')
    setTimeout(combobox.resetSelectedOption)
  },
})

// Keeps the retained lookup and the displayed label in step with the value.
watch(
  [() => current(), lockup],
  () => {
    const value = current()

    if (value != null && lockup.value[String(value)]) {
      retained[String(value)] = lockup.value[String(value)]
    }

    if (!searchControlled()) {
      internalSearch.value =
        value == null ? '' : ((lockup.value[String(value)] ?? retained[String(value)])?.label ?? '')
    }
  },
  { immediate: true },
)

watch(
  () => search(),
  () => {
    if (props.selectFirstOptionOnChange) {
      nextTick(combobox.selectFirstOption)
    }
  },
)

const id = useId((attrs as any).id)

function clear(event?: MouseEvent) {
  // The clear button lives inside the input, whose click toggles the dropdown.
  event?.stopPropagation()
  changeValue(null, null)
  setSearch('')
  emit('clear')
}

const disabled = computed(() => !!(attrs as any).disabled)
const readOnly = computed(() => !!(attrs as any).readOnly)

const clearable = computed(
  () => props.clearable && current() != null && !disabled.value && !readOnly.value,
)

/**
 * These are consumed here – by the hidden input, the chevron or the clear button – so
 * they must not also reach `InputBase` through the fallthrough attributes.
 */
const forwarded = computed(() => {
  const result = { ...attrs }
  delete result.id
  delete result.name
  delete result.form
  delete result.rightSection
  delete result.clearButtonProps
  delete result.clearSectionMode
  delete result.chevronColor
  return result
})

const comboboxSize = computed(() => (attrs as any).size ?? 'sm')

function onOptionSubmit(value: string) {
  emit('option-submit', lockup.value[value]?.value)

  // Submitting the already selected option deselects it when `allowDeselect` is set.
  const option =
    props.allowDeselect && String(current()) === String(value) ? null : lockup.value[value]
  const next = option?.value ?? null

  if (next !== current()) {
    changeValue(next, option ?? null)
  }

  if (!searchControlled()) {
    internalSearch.value = option?.label ?? ''
  }

  combobox.closeDropdown()
}

function onInput(event: Event) {
  setSearch((event.currentTarget as HTMLInputElement).value)
  combobox.openDropdown()
}

function onFocus(event: FocusEvent) {
  if (props.openOnFocus && props.searchable) {
    combobox.openDropdown()
  }

  ;(attrs as any).onFocus?.(event)
}

function onBlur(event: FocusEvent) {
  if (props.autoSelectOnBlur) {
    combobox.clickSelectedOption()
  }

  if (props.searchable) {
    combobox.closeDropdown()
  }

  // A half-typed search is discarded and the selected label restored.
  setSearch(selected.value?.label ?? '')
  ;(attrs as any).onBlur?.(event)
}

function onClick(event: MouseEvent) {
  // A searchable input only opens on click; a plain one toggles, so a second click closes.
  if (props.searchable) {
    combobox.openDropdown()
  } else {
    combobox.toggleDropdown()
  }

  ;(attrs as any).onClick?.(event)
}

const defaultRightSection = computed(() =>
  h(ComboboxChevron, {
    size: comboboxSize.value,
    error: (attrs as any).error,
    color: props.chevronColor,
    unstyled: (attrs as any).unstyled,
  }),
)

const clearSection = computed(() =>
  h(ComboboxClearButton, { ...(attrs as any).clearButtonProps, onClick: clear }),
)

const labelId = computed(() => ((attrs as any).label ? `${id.value}-label` : undefined))

/** Filtering is skipped while the search still equals the selected label. */
const filterOptions = computed(() => !!props.searchable && selected.value?.label !== search())

const hiddenWhenEmpty = computed(() => !props.nothingFoundMessage && !slots.nothingFound)
</script>

<template>
  <Combobox
    v-bind="props.comboboxProps"
    :store="combobox"
    __static-selector="Select"
    :read-only="readOnly"
    :size="comboboxSize"
    @option-submit="onOptionSubmit"
  >
    <ComboboxTarget
      :target-type="props.searchable ? 'input' : 'button'"
      :with-expanded-attribute="true"
      :auto-complete="(attrs as any).autoComplete"
    >
      <!--
        `InputBase` has to be the direct child: `Combobox.Target` clones the child vnode
        to inject `aria-expanded` and the combobox event handlers, so any wrapper would
        swallow them.
      -->
      <InputBase
        v-bind="forwarded"
        :id="id"
        :__default-right-section="defaultRightSection"
        :__clear-section="clearSection"
        :__clearable="clearable"
        :__clear-section-mode="props.clearSectionMode"
        __static-selector="Select"
        component="input"
        :disabled="disabled"
        :read-only="readOnly || !props.searchable"
        :pointer="!props.searchable"
        :model-value="search()"
        :right-section="(attrs as any).rightSection"
        :right-section-pointer-events="(attrs as any).rightSectionPointerEvents || 'none'"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @click="onClick"
      >
        <!-- The input level slots are forwarded so `label`, `error` and the sections keep working. -->
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
      </InputBase>
    </ComboboxTarget>

    <OptionsDropdown
      :data="parsed as any"
      :hidden="readOnly || disabled"
      :filter="props.filter"
      :search="search()"
      :limit="props.limit"
      :hidden-when-empty="hiddenWhenEmpty"
      :with-scroll-area="props.withScrollArea"
      :max-dropdown-height="props.maxDropdownHeight"
      :filter-options="filterOptions"
      :value="current()"
      :check-icon-position="props.checkIconPosition"
      :with-check-icon="props.withCheckIcon"
      :with-aligned-labels="props.withAlignedLabels"
      :nothing-found-message="props.nothingFoundMessage"
      :label-id="labelId"
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
    :value="current()"
    :name="(attrs as any).name"
    :form="(attrs as any).form"
    :disabled="disabled"
  />
</template>
