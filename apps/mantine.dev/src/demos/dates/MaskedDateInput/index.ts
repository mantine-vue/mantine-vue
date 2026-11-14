import { createVueDemo } from '@/demo'
import UsageDemo from './MaskedDateInput.demo.usage.vue'
import usageCode from './MaskedDateInput.demo.usage.vue?raw'
import ControlledDemo from './MaskedDateInput.demo.controlled.vue'
import controlledCode from './MaskedDateInput.demo.controlled.vue?raw'
import WithTimeDemo from './MaskedDateInput.demo.withTime.vue'
import withTimeCode from './MaskedDateInput.demo.withTime.vue?raw'
import WithSecondsDemo from './MaskedDateInput.demo.withSeconds.vue'
import withSecondsCode from './MaskedDateInput.demo.withSeconds.vue?raw'
import Format12hDemo from './MaskedDateInput.demo.format12h.vue'
import format12hCode from './MaskedDateInput.demo.format12h.vue?raw'
import AmPmLabelsDemo from './MaskedDateInput.demo.amPmLabels.vue'
import amPmLabelsCode from './MaskedDateInput.demo.amPmLabels.vue?raw'
import DateSeparatorDemo from './MaskedDateInput.demo.dateSeparator.vue'
import dateSeparatorCode from './MaskedDateInput.demo.dateSeparator.vue?raw'
import TimeSeparatorDemo from './MaskedDateInput.demo.timeSeparator.vue'
import timeSeparatorCode from './MaskedDateInput.demo.timeSeparator.vue?raw'
import FieldsOrderDemo from './MaskedDateInput.demo.fieldsOrder.vue'
import fieldsOrderCode from './MaskedDateInput.demo.fieldsOrder.vue?raw'
import MinMaxDemo from './MaskedDateInput.demo.minMax.vue'
import minMaxCode from './MaskedDateInput.demo.minMax.vue?raw'
import AllowDeselectDemo from './MaskedDateInput.demo.allowDeselect.vue'
import allowDeselectCode from './MaskedDateInput.demo.allowDeselect.vue?raw'
import WithDropdownDemo from './MaskedDateInput.demo.withDropdown.vue'
import withDropdownCode from './MaskedDateInput.demo.withDropdown.vue?raw'
import DropdownPositionDemo from './MaskedDateInput.demo.dropdownPosition.vue'
import dropdownPositionCode from './MaskedDateInput.demo.dropdownPosition.vue?raw'
import StepsDemo from './MaskedDateInput.demo.steps.vue'
import stepsCode from './MaskedDateInput.demo.steps.vue?raw'
import PasteSplitDemo from './MaskedDateInput.demo.pasteSplit.vue'
import pasteSplitCode from './MaskedDateInput.demo.pasteSplit.vue?raw'
import ClearableDemo from './MaskedDateInput.demo.clearable.vue'
import clearableCode from './MaskedDateInput.demo.clearable.vue?raw'
import ClearSectionModeDemo from './MaskedDateInput.demo.clearSectionMode.vue'
import clearSectionModeCode from './MaskedDateInput.demo.clearSectionMode.vue?raw'
import DisabledDemo from './MaskedDateInput.demo.disabled.vue'
import disabledCode from './MaskedDateInput.demo.disabled.vue?raw'
import ReadOnlyDemo from './MaskedDateInput.demo.readOnly.vue'
import readOnlyCode from './MaskedDateInput.demo.readOnly.vue?raw'

export const MaskedDateInputDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { maxWidth: 340, withPadding: true }),
  controlled: createVueDemo(ControlledDemo, controlledCode, { maxWidth: 340, withPadding: true }),
  withTime: createVueDemo(WithTimeDemo, withTimeCode, { maxWidth: 340, withPadding: true }),
  withSeconds: createVueDemo(WithSecondsDemo, withSecondsCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  format12h: createVueDemo(Format12hDemo, format12hCode, { maxWidth: 340, withPadding: true }),
  amPmLabels: createVueDemo(AmPmLabelsDemo, amPmLabelsCode, { maxWidth: 340, withPadding: true }),
  dateSeparator: createVueDemo(DateSeparatorDemo, dateSeparatorCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  timeSeparator: createVueDemo(TimeSeparatorDemo, timeSeparatorCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  fieldsOrder: createVueDemo(FieldsOrderDemo, fieldsOrderCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  minMax: createVueDemo(MinMaxDemo, minMaxCode, { maxWidth: 340, withPadding: true }),
  allowDeselect: createVueDemo(AllowDeselectDemo, allowDeselectCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  withDropdown: createVueDemo(WithDropdownDemo, withDropdownCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  dropdownPosition: createVueDemo(DropdownPositionDemo, dropdownPositionCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  steps: createVueDemo(StepsDemo, stepsCode, { maxWidth: 340, withPadding: true }),
  pasteSplit: createVueDemo(PasteSplitDemo, pasteSplitCode, { maxWidth: 340, withPadding: true }),
  clearable: createVueDemo(ClearableDemo, clearableCode, { maxWidth: 340, withPadding: true }),
  clearSectionMode: createVueDemo(ClearSectionModeDemo, clearSectionModeCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  disabled: createVueDemo(DisabledDemo, disabledCode, { maxWidth: 340, withPadding: true }),
  readOnly: createVueDemo(ReadOnlyDemo, readOnlyCode, { maxWidth: 340, withPadding: true }),
}
