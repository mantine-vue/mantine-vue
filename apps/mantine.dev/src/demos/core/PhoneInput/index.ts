import { createVueDemo } from '@/demo'
import UsageDemo from './PhoneInput.demo.usage.vue'
import usageCode from './PhoneInput.demo.usage.vue?raw'
import LoadingDemo from './PhoneInput.demo.loading.vue'
import loadingCode from './PhoneInput.demo.loading.vue?raw'
import ControlledDemo from './PhoneInput.demo.controlled.vue'
import controlledCode from './PhoneInput.demo.controlled.vue?raw'
import PreferredCountriesDemo from './PhoneInput.demo.preferredCountries.vue'
import preferredCountriesCode from './PhoneInput.demo.preferredCountries.vue?raw'
import OnlyCountriesDemo from './PhoneInput.demo.onlyCountries.vue'
import onlyCountriesCode from './PhoneInput.demo.onlyCountries.vue?raw'
import ExcludeCountriesDemo from './PhoneInput.demo.excludeCountries.vue'
import excludeCountriesCode from './PhoneInput.demo.excludeCountries.vue?raw'
import EmojiFlagDemo from './PhoneInput.demo.emojiFlag.vue'
import emojiFlagCode from './PhoneInput.demo.emojiFlag.vue?raw'
import SearchableDemo from './PhoneInput.demo.searchable.vue'
import searchableCode from './PhoneInput.demo.searchable.vue?raw'
import CountryAutoDetectDemo from './PhoneInput.demo.countryAutoDetect.vue'
import countryAutoDetectCode from './PhoneInput.demo.countryAutoDetect.vue?raw'
import LocalizationDemo from './PhoneInput.demo.localization.vue'
import localizationCode from './PhoneInput.demo.localization.vue?raw'
import DropdownPositionDemo from './PhoneInput.demo.dropdownPosition.vue'
import dropdownPositionCode from './PhoneInput.demo.dropdownPosition.vue?raw'
import WithinPopoverDemo from './PhoneInput.demo.withinPopover.vue'
import withinPopoverCode from './PhoneInput.demo.withinPopover.vue?raw'
import DisabledDemo from './PhoneInput.demo.disabled.vue'
import disabledCode from './PhoneInput.demo.disabled.vue?raw'
import ReadOnlyDemo from './PhoneInput.demo.readOnly.vue'
import readOnlyCode from './PhoneInput.demo.readOnly.vue?raw'
import ErrorDemo from './PhoneInput.demo.error.vue'
import errorCode from './PhoneInput.demo.error.vue?raw'

export const PhoneInputDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { maxWidth: 340, withPadding: true }),
  loading: createVueDemo(LoadingDemo, loadingCode, { maxWidth: 340, withPadding: true }),
  controlled: createVueDemo(ControlledDemo, controlledCode, { maxWidth: 340, withPadding: true }),
  preferredCountries: createVueDemo(PreferredCountriesDemo, preferredCountriesCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  onlyCountries: createVueDemo(OnlyCountriesDemo, onlyCountriesCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  excludeCountries: createVueDemo(ExcludeCountriesDemo, excludeCountriesCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  emojiFlag: createVueDemo(EmojiFlagDemo, emojiFlagCode, { maxWidth: 340, withPadding: true }),
  searchable: createVueDemo(SearchableDemo, searchableCode, { maxWidth: 340, withPadding: true }),
  countryAutoDetect: createVueDemo(CountryAutoDetectDemo, countryAutoDetectCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  localization: createVueDemo(LocalizationDemo, localizationCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  dropdownPosition: createVueDemo(DropdownPositionDemo, dropdownPositionCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  withinPopover: createVueDemo(WithinPopoverDemo, withinPopoverCode, { centered: true }),
  disabled: createVueDemo(DisabledDemo, disabledCode, { maxWidth: 340, withPadding: true }),
  readOnly: createVueDemo(ReadOnlyDemo, readOnlyCode, { maxWidth: 340, withPadding: true }),
  error: createVueDemo(ErrorDemo, errorCode, { maxWidth: 340, withPadding: true }),
}
