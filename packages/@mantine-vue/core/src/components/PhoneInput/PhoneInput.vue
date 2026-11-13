<script lang="ts">
import inputClasses from '../Input/Input.module.css'
import classes from './PhoneInput.module.css'

const mergedClasses = { ...inputClasses, ...classes }

const leftSectionWidth: Record<string, number> = {
  xs: 42,
  sm: 42,
  md: 50,
  lg: 54,
  xl: 58,
}

const defaultProps = {
  size: 'sm',
  searchable: true,
  international: true,
  maxDropdownHeight: 250,
  searchPlaceholder: 'Search countries',
  selectCountryLabel: 'Select country',
} as const

export { mergedClasses, defaultProps }
</script>

<script setup lang="ts">
import { computed, h, nextTick, ref, useAttrs, watch } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { omitAttrs, useProps, useStyles } from '../../core'
import {
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  ComboboxSearch,
  ComboboxTarget,
  useCombobox,
} from '../Combobox'
import { InputBase } from '../InputBase'
import { ScrollAreaAutosize } from '../ScrollArea'
import { UnstyledButton } from '../UnstyledButton'
import { buildRawValue } from './build-raw-value/build-raw-value'
import { computeCursorPosition } from './compute-cursor-position/compute-cursor-position'
import { clampToMask, formatPhoneNumber } from './format-phone-number/format-phone-number'
import { filterCountries, getCountries } from './get-countries/get-countries'
import { getDigits } from './get-digits/get-digits'
import { guessCountry, matchesAreaCode } from './guess-country/guess-country'
import { ALL_COUNTRIES, type PhoneInputCountryData } from './phone-data'
import type {
  PhoneInputChangeDetails,
  PhoneInputEmits,
  PhoneInputOwnProps,
  PhoneInputSlots,
} from './PhoneInput.types'

defineOptions({ name: 'PhoneInput', inheritAttrs: false })

const rawProps = withDefaults(defineProps<PhoneInputOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  searchable: undefined,
  international: undefined,
  withCountryAutoDetect: false,
  dropdownOpened: undefined,
  withChevron: false,
  readOnly: false,
  disabled: false,
  unstyled: false,
})
const emit = defineEmits<PhoneInputEmits>()
const slots = defineSlots<PhoneInputSlots>()
const attrs = useAttrs()
const props = useProps('PhoneInput', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'PhoneInput',
  props,
  classes: mergedClasses,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
})

const inputElement = ref<HTMLInputElement | null>(null)
let countryLocked = false
let lastEmittedValue: string | undefined

const countriesData = computed(() =>
  getCountries(ALL_COUNTRIES, {
    onlyCountries: props.onlyCountries,
    excludeCountries: props.excludeCountries,
    preferredCountries: props.preferredCountries,
  }),
)
const filteredCountries = computed(() => countriesData.value.countries)
const preferredList = computed(() => countriesData.value.preferredList)

const findCountryByIso2 = (iso2: string) =>
  filteredCountries.value.find((country) => country.iso2 === iso2.toLowerCase())

const initialValue = props.modelValue ?? props.defaultValue
const inferredFromValue = initialValue
  ? guessCountry(initialValue, filteredCountries.value)
  : undefined
const defaultCountryData = props.defaultCountry
  ? findCountryByIso2(props.defaultCountry)
  : undefined
const initialCountry = inferredFromValue || defaultCountryData || null

const selectedCountry = ref<PhoneInputCountryData | null>(initialCountry)
const search = ref('')
const activeOptionId = ref<string | null>(null)

const [value, setValue] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: initialCountry && props.international ? `+${initialCountry.dialCode}` : '',
})

const combobox = useCombobox({
  opened: () => props.dropdownOpened,
  onDropdownOpen: () => {
    if (props.searchable) combobox.focusSearchInput()
    else combobox.focusTarget()
    emit('dropdown-open')
  },
  onDropdownClose: () => {
    search.value = ''
    activeOptionId.value = null
    emit('dropdown-close')
  },
})

const isDetectedCountryDifferent = (
  detected: PhoneInputCountryData,
  current: PhoneInputCountryData | null,
  rawValue: string,
) =>
  detected.iso2 !== current?.iso2 &&
  (detected.dialCode !== current?.dialCode || matchesAreaCode(detected, rawValue))

function setCountry(country: PhoneInputCountryData) {
  selectedCountry.value = country
  emit('country-change', country)
}

watch(
  [() => props.modelValue, filteredCountries],
  () => {
    const current = props.modelValue
    const isOwnEcho = current !== undefined && current === lastEmittedValue
    const detected =
      current && !isOwnEcho ? guessCountry(current, filteredCountries.value) : undefined

    if (detected) {
      if (isDetectedCountryDifferent(detected, selectedCountry.value, current ?? '')) {
        setCountry(detected)
      }
      return
    }

    if (
      selectedCountry.value &&
      !filteredCountries.value.find((country) => country.iso2 === selectedCountry.value!.iso2)
    ) {
      const fallback = filteredCountries.value[0] || null
      selectedCountry.value = fallback
      if (fallback) emit('country-change', fallback)
    }
  },
  { immediate: true },
)

watch(search, () => {
  if (combobox.dropdownOpened) nextTick(combobox.selectFirstOption)
})

const toDisplayValue = (formatted: string, country: PhoneInputCountryData | null) =>
  props.international || !country ? formatted : formatted.replace(`+${country.dialCode} `, '')

const formattedValue = computed(() =>
  value.value === '+'
    ? '+'
    : selectedCountry.value
      ? formatPhoneNumber(value.value, selectedCountry.value)
      : value.value,
)
const displayValue = computed(() => toDisplayValue(formattedValue.value, selectedCountry.value))

function setInputRef(node: any) {
  inputElement.value = node?.$el ?? node ?? null
  assignRef((attrs as any).rootRef, inputElement.value)
}

/** Keeps the DOM value in sync when the formatted value did not change after the input. */
function syncInput(selection?: number) {
  nextTick(() => {
    const input = inputElement.value
    if (!input) return
    if (input.value !== displayValue.value) input.value = displayValue.value
    if (
      selection !== undefined &&
      typeof document !== 'undefined' &&
      document.activeElement === input
    ) {
      requestAnimationFrame(() => input.setSelectionRange(selection, selection))
    }
  })
}

function focusInputAfterDialCode(country: PhoneInputCountryData, rawValue: string) {
  requestAnimationFrame(() => {
    const input = inputElement.value
    if (!input) return
    input.focus()
    if (!props.international) {
      input.setSelectionRange(0, 0)
      return
    }
    const formatted = formatPhoneNumber(rawValue, country)
    const dialCodePrefix = `+${country.dialCode} `
    const cursorPos = formatted.startsWith(dialCodePrefix)
      ? dialCodePrefix.length
      : formatted.length
    input.setSelectionRange(cursorPos, cursorPos)
  })
}

function emitChange(rawValue: string, details: PhoneInputChangeDetails) {
  lastEmittedValue = rawValue
  setValue(rawValue)
  emit('update:modelValue', rawValue)
  emit('change', rawValue, details)
}

function handleValueChange(rawValue: string, country: PhoneInputCountryData | null) {
  const formatted = country ? formatPhoneNumber(rawValue, country) : rawValue
  emitChange(rawValue, { formattedValue: formatted, country })
}

function handleInput(event: Event) {
  ;(attrs as any).onInput?.(event)
  const input = event.currentTarget as HTMLInputElement
  const restartIndex = Math.max(input.value.lastIndexOf('+'), 0)
  const inputValue = input.value.slice(restartIndex)
  const cursorPos = Math.max((input.selectionStart ?? input.value.length) - restartIndex, 0)
  const digitsOnly = getDigits(inputValue).replace(/^\+/, '')
  const hasPlus = inputValue.includes('+')
  const current = selectedCountry.value
  const autoDetectEnabled = props.withCountryAutoDetect || !current
  const canAutoDetect = autoDetectEnabled && !countryLocked

  if (!digitsOnly) {
    if (props.withCountryAutoDetect || !current) {
      countryLocked = false
    }

    if (hasPlus) {
      emitChange('+', { formattedValue: '+', country: current })
      syncInput(1)
    } else if (props.withCountryAutoDetect || !current || !props.international) {
      handleValueChange('', current)
      syncInput()
    } else {
      const minRaw = `+${current.dialCode}`
      handleValueChange(minRaw, current)
      syncInput(formatPhoneNumber(minRaw, current).length)
    }
    return
  }

  const typedRaw = getDigits(inputValue)
  const hasInternationalPrefix = typedRaw.startsWith('+')
  const dialCodeTyped = hasInternationalPrefix || (autoDetectEnabled && props.international)
  const typedCountry =
    current && dialCodeTyped && (countryLocked || !autoDetectEnabled)
      ? guessCountry(typedRaw, filteredCountries.value)
      : undefined
  const dialCodeChanged = !!typedCountry && typedCountry.dialCode !== current?.dialCode
  const dialCodeIncomplete = hasInternationalPrefix && !canAutoDetect && !typedCountry
  const detectNow = canAutoDetect || dialCodeChanged || dialCodeIncomplete

  if (dialCodeChanged) {
    countryLocked = false
  }

  const fullRaw = buildRawValue(inputValue, {
    canAutoDetect: detectNow,
    international: !!props.international,
    selectedCountry: current,
  })
  let country = current

  if (detectNow) {
    const detected = guessCountry(fullRaw, filteredCountries.value)
    if (detected && isDetectedCountryDifferent(detected, current, fullRaw)) {
      country = detected
      setCountry(detected)
    }
  }

  const newRaw = detectNow ? fullRaw : clampToMask(fullRaw, country)
  const newFormatted = country ? formatPhoneNumber(newRaw, country) : newRaw
  const newDisplayRaw =
    props.international || !country ? newRaw : newRaw.slice(country.dialCode.length + 1)
  const newCursor = computeCursorPosition(
    inputValue,
    cursorPos,
    newDisplayRaw,
    toDisplayValue(newFormatted, country),
  )

  emitChange(newRaw, { formattedValue: newFormatted, country })
  syncInput(newCursor)
}

function handleKeydown(event: KeyboardEvent) {
  ;(attrs as any).onKeydown?.(event)

  if (props.readOnly || !combobox.dropdownOpened || event.isComposing) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeOptionId.value = combobox.selectNextOption()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeOptionId.value = combobox.selectPreviousOption()
  } else if (event.key === 'Enter' && combobox.getSelectedOptionIndex() !== -1) {
    event.preventDefault()
    combobox.clickSelectedOption()
  } else if (event.key === 'Escape') {
    combobox.closeDropdown('keyboard')
  }
}

function handleCountrySelect(iso2: string) {
  const country = findCountryByIso2(String(iso2))
  if (!country) {
    return
  }

  const previousCountry = selectedCountry.value
  countryLocked = true
  setCountry(country)

  const currentDigits = value.value.replace(/\D/g, '')
  const oldDialCode = previousCountry?.dialCode
  const newRaw =
    oldDialCode && currentDigits.startsWith(oldDialCode)
      ? `+${country.dialCode}${currentDigits.slice(oldDialCode.length)}`
      : `+${country.dialCode}`

  const clamped = clampToMask(newRaw, country)
  handleValueChange(clamped, country)
  combobox.closeDropdown()
  focusInputAfterDialCode(country, clamped)
}

const preferredIso2Set = computed(() => new Set(preferredList.value.map((country) => country.iso2)))
const mainCountries = computed(() =>
  preferredIso2Set.value.size > 0
    ? filteredCountries.value.filter((country) => !preferredIso2Set.value.has(country.iso2))
    : filteredCountries.value,
)
const searchedCountries = computed(() =>
  search.value
    ? filterCountries(mainCountries.value, search.value, props.getCountryLabel)
    : mainCountries.value,
)
const searchedPreferred = computed(() =>
  search.value
    ? filterCountries(preferredList.value, search.value, props.getCountryLabel)
    : preferredList.value,
)

const countryButtonLabel = computed(() =>
  selectedCountry.value
    ? (props.getCountryLabel?.(selectedCountry.value) ?? selectedCountry.value.name)
    : props.selectCountryLabel,
)

const hasFlagRenderer = computed(() => !!slots.flag || !!props.renderFlag)
const renderFlag = (country: PhoneInputCountryData | null) =>
  slots.flag ? slots.flag({ country }) : props.renderFlag?.(country)

const countryButton = computed(() =>
  h(
    UnstyledButton as any,
    {
      type: 'button',
      disabled: props.disabled || props.readOnly,
      'aria-label': countryButtonLabel.value,
      'aria-haspopup': 'listbox',
      'aria-expanded': combobox.dropdownOpened,
      'aria-controls': combobox.dropdownOpened && combobox.listId ? combobox.listId : undefined,
      ...getStyles('countryButton', { focusable: true }),
      onClick: () => combobox.toggleDropdown(),
    },
    () => [
      hasFlagRenderer.value
        ? h('span', getStyles('countryButtonFlag'), [renderFlag(selectedCountry.value) as any])
        : selectedCountry.value
          ? h('span', getStyles('countryButtonCode'), selectedCountry.value.iso2.toUpperCase())
          : null,
      props.withChevron ? h(ComboboxChevron, { size: props.size }) : null,
    ],
  ),
)

const renderOptionContent = (country: PhoneInputCountryData) => {
  if (slots.countryOption) return slots.countryOption({ country })
  if (props.renderCountryOption) return props.renderCountryOption(country)
  return h('span', getStyles('countryOption'), [
    hasFlagRenderer.value ? (renderFlag(country) as any) : null,
    h('span', getStyles('optionName'), country.name),
    h('span', getStyles('optionDialCode'), `+${country.dialCode}`),
  ])
}

const OptionContent = (optionProps: { country: PhoneInputCountryData }) =>
  renderOptionContent(optionProps.country)

const inputAttrs = computed(() => omitAttrs(attrs, ['onInput', 'onKeydown', 'rootRef']))

const showNothingFound = computed(
  () =>
    searchedCountries.value.length === 0 &&
    searchedPreferred.value.length === 0 &&
    (!!props.nothingFoundMessage || !!slots.nothingFound),
)

defineExpose({ inputElement })
</script>

<template>
  <Combobox
    v-bind="props.comboboxProps"
    :store="combobox"
    __static-selector="PhoneInput"
    :class-names="props.classNames"
    :styles="props.styles"
    :unstyled="props.unstyled"
    :size="props.size"
    :read-only="props.readOnly"
    @option-submit="handleCountrySelect"
  >
    <ComboboxTarget
      target-type="input"
      :with-keyboard-navigation="false"
      :with-aria-attributes="false"
    >
      <InputBase
        v-bind="inputAttrs"
        :root-ref="setInputRef"
        type="tel"
        component="input"
        __static-selector="PhoneInput"
        :__styles-api-props="props"
        :class-names="props.classNames"
        :styles="props.styles"
        :unstyled="props.unstyled"
        :autocomplete="props.autoComplete ?? 'off'"
        :aria-controls="combobox.dropdownOpened && combobox.listId ? combobox.listId : undefined"
        :aria-activedescendant="combobox.dropdownOpened ? activeOptionId || undefined : undefined"
        :data-expanded="combobox.dropdownOpened || undefined"
        :data-mantine-stop-propagation="combobox.dropdownOpened || undefined"
        :left-section="countryButton"
        left-section-pointer-events="all"
        :left-section-width="leftSectionWidth[props.size as string]"
        :size="props.size"
        :disabled="props.disabled"
        :read-only="props.readOnly"
        :model-value="displayValue"
        @input="handleInput"
        @keydown="handleKeydown"
      >
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
      </InputBase>
    </ComboboxTarget>

    <ComboboxDropdown :hidden="props.readOnly || props.disabled">
      <ComboboxSearch
        v-if="props.searchable"
        v-model="search"
        :placeholder="props.searchPlaceholder"
        autocomplete="search-countries"
        @update:model-value="combobox.resetSelectedOption()"
      />

      <ComboboxOptions>
        <ScrollAreaAutosize :mah="props.maxDropdownHeight" type="scroll">
          <template v-if="searchedPreferred.length > 0">
            <ComboboxOption
              v-for="country in searchedPreferred"
              :key="`preferred-${country.iso2}`"
              :value="country.iso2"
            >
              <OptionContent :country="country" />
            </ComboboxOption>
            <div v-bind="getStyles('divider')" />
          </template>

          <ComboboxOption
            v-for="country in searchedCountries"
            :key="country.iso2"
            :value="country.iso2"
          >
            <OptionContent :country="country" />
          </ComboboxOption>

          <ComboboxEmpty v-if="showNothingFound">
            <slot name="nothingFound"><component :is="() => props.nothingFoundMessage" /></slot>
          </ComboboxEmpty>
        </ScrollAreaAutosize>
      </ComboboxOptions>
    </ComboboxDropdown>
  </Combobox>
</template>
