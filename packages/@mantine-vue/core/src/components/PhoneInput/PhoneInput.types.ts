import type { VNodeChild } from 'vue'
import type { MantineNode, MantineSize, StylesApiProps } from '../../core'
import type { ComboboxProps } from '../Combobox'
import type { PhoneInputCountryData } from './phone-data'

export type PhoneInputStylesNames =
  | 'wrapper'
  | 'input'
  | 'section'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'countryButton'
  | 'countryButtonFlag'
  | 'countryButtonCode'
  | 'dropdown'
  | 'search'
  | 'countryOption'
  | 'optionDialCode'
  | 'optionName'
  | 'divider'

export interface PhoneInputChangeDetails {
  /** Formatted display string, e.g. "+1 (202) 555-1234" */
  formattedValue: string
  /** Country data for the currently selected country, null when no country is selected */
  country: PhoneInputCountryData | null
}

/** Props declared by `PhoneInput` itself, all other props are passed down to `InputBase`. */
export interface PhoneInputOwnProps extends StylesApiProps<any> {
  /** Controlled value — raw digits with + prefix, e.g. "+12025551234" */
  modelValue?: string
  /** Uncontrolled default value */
  defaultValue?: string
  /** Default country ISO2 code, e.g. "us" */
  defaultCountry?: string
  /** Countries pinned to top of dropdown with separator, ISO2 codes */
  preferredCountries?: string[]
  /** Only show these countries, ISO2 codes */
  onlyCountries?: string[]
  /** Hide these countries, ISO2 codes */
  excludeCountries?: string[]
  /** Enable search in country dropdown @default true */
  searchable?: boolean
  /** Show +dialCode in input @default true */
  international?: boolean
  /** Auto-detect country from typed dial code digits @default false */
  withCountryAutoDetect?: boolean
  /** Custom flag renderer for country selector button and dropdown options, receives null when no country is selected */
  renderFlag?: (country: PhoneInputCountryData | null) => VNodeChild
  /** Custom renderer for country dropdown options */
  renderCountryOption?: (country: PhoneInputCountryData) => VNodeChild
  /** Maximum dropdown height in px @default 250 */
  maxDropdownHeight?: number | string
  /** Controlled dropdown opened state */
  dropdownOpened?: boolean
  /** Props passed down to the underlying Combobox component */
  comboboxProps?: Partial<ComboboxProps> & Record<string, any>
  /** Display chevron in the country button @default false */
  withChevron?: boolean
  /** Message displayed when no countries match the search query */
  nothingFoundMessage?: MantineNode
  /** Placeholder of the search input in the dropdown @default 'Search countries' */
  searchPlaceholder?: string
  /** `aria-label` of the country button when no country is selected @default 'Select country' */
  selectCountryLabel?: string
  /** Returns a localized country name, used as the country button `aria-label` and matched in search in addition to the English name */
  getCountryLabel?: (country: PhoneInputCountryData) => string
  /** Controls input `height`, horizontal `padding` and `font-size` @default 'sm' */
  size?: MantineSize | (string & {})
  /** If set, the input value cannot be changed @default false */
  readOnly?: boolean
  /** If set, the input is disabled @default false */
  disabled?: boolean
  /** Input `autocomplete` attribute @default 'off' */
  autoComplete?: string
}

export interface PhoneInputProps extends PhoneInputOwnProps {
  [key: string]: any
}

export interface PhoneInputSlots {
  /** Custom flag renderer, takes precedence over `renderFlag` prop */
  flag?: (props: { country: PhoneInputCountryData | null }) => VNodeChild
  /** Custom country option renderer, takes precedence over `renderCountryOption` prop */
  countryOption?: (props: { country: PhoneInputCountryData }) => VNodeChild
  /** Content displayed when no countries match the search query */
  nothingFound?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  error?: () => VNodeChild
  rightSection?: () => VNodeChild
}

export interface PhoneInputEmits {
  'update:modelValue': [value: string]
  /** Called when value changes */
  change: [value: string, details: PhoneInputChangeDetails]
  /** Called when selected country changes */
  'country-change': [country: PhoneInputCountryData]
  /** Called when dropdown opens */
  'dropdown-open': []
  /** Called when dropdown closes */
  'dropdown-close': []
}
