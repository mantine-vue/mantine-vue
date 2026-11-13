import { createVueDemo } from '@/demo'
import UsageDemo from './WeekPickerInput.demo.usage.vue'
import usageCode from './WeekPickerInput.demo.usage.vue?raw'
import MultipleDemo from './WeekPickerInput.demo.multiple.vue'
import multipleCode from './WeekPickerInput.demo.multiple.vue?raw'
import RangeDemo from './WeekPickerInput.demo.range.vue'
import rangeCode from './WeekPickerInput.demo.range.vue?raw'
import ClearableDemo from './WeekPickerInput.demo.clearable.vue'
import clearableCode from './WeekPickerInput.demo.clearable.vue?raw'
import ModalDemo from './WeekPickerInput.demo.modal.vue'
import modalCode from './WeekPickerInput.demo.modal.vue?raw'
import ValueFormatDemo from './WeekPickerInput.demo.valueFormat.vue'
import valueFormatCode from './WeekPickerInput.demo.valueFormat.vue?raw'
import WeekNumberFormatterDemo from './WeekPickerInput.demo.weekNumberFormatter.vue'
import weekNumberFormatterCode from './WeekPickerInput.demo.weekNumberFormatter.vue?raw'
import FirstDayOfWeekDemo from './WeekPickerInput.demo.firstDayOfWeek.vue'
import firstDayOfWeekCode from './WeekPickerInput.demo.firstDayOfWeek.vue?raw'
import DisabledDemo from './WeekPickerInput.demo.disabled.vue'
import disabledCode from './WeekPickerInput.demo.disabled.vue?raw'
import MinMaxDemo from './WeekPickerInput.demo.minMax.vue'
import minMaxCode from './WeekPickerInput.demo.minMax.vue?raw'
import PresetsDemo from './WeekPickerInput.demo.presets.vue'
import presetsCode from './WeekPickerInput.demo.presets.vue?raw'
import PresetsRangeDemo from './WeekPickerInput.demo.presetsRange.vue'
import presetsRangeCode from './WeekPickerInput.demo.presetsRange.vue?raw'
import MaxLevelDemo from './WeekPickerInput.demo.maxLevel.vue'
import maxLevelCode from './WeekPickerInput.demo.maxLevel.vue?raw'
import NativeLevelSelectDemo from './WeekPickerInput.demo.nativeLevelSelect.vue'
import nativeLevelSelectCode from './WeekPickerInput.demo.nativeLevelSelect.vue?raw'

export const WeekPickerInputDemos = {
  usage: createVueDemo(UsageDemo, usageCode),
  multiple: createVueDemo(MultipleDemo, multipleCode),
  range: createVueDemo(RangeDemo, rangeCode),
  clearable: createVueDemo(ClearableDemo, clearableCode),
  modal: createVueDemo(ModalDemo, modalCode),
  valueFormat: createVueDemo(ValueFormatDemo, valueFormatCode),
  weekNumberFormatter: createVueDemo(WeekNumberFormatterDemo, weekNumberFormatterCode),
  firstDayOfWeek: createVueDemo(FirstDayOfWeekDemo, firstDayOfWeekCode),
  disabled: createVueDemo(DisabledDemo, disabledCode),
  minMax: createVueDemo(MinMaxDemo, minMaxCode),
  presets: createVueDemo(PresetsDemo, presetsCode),
  presetsRange: createVueDemo(PresetsRangeDemo, presetsRangeCode),
  maxLevel: createVueDemo(MaxLevelDemo, maxLevelCode),
  nativeLevelSelect: createVueDemo(NativeLevelSelectDemo, nativeLevelSelectCode),
}
