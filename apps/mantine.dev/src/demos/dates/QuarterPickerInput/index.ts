import { createVueDemo } from '@/demo'
import UsageDemo from './QuarterPickerInput.demo.usage.vue'
import usageCode from './QuarterPickerInput.demo.usage.vue?raw'
import MultipleDemo from './QuarterPickerInput.demo.multiple.vue'
import multipleCode from './QuarterPickerInput.demo.multiple.vue?raw'
import RangeDemo from './QuarterPickerInput.demo.range.vue'
import rangeCode from './QuarterPickerInput.demo.range.vue?raw'
import ClearableDemo from './QuarterPickerInput.demo.clearable.vue'
import clearableCode from './QuarterPickerInput.demo.clearable.vue?raw'
import ModalDemo from './QuarterPickerInput.demo.modal.vue'
import modalCode from './QuarterPickerInput.demo.modal.vue?raw'
import ValueFormatDemo from './QuarterPickerInput.demo.valueFormat.vue'
import valueFormatCode from './QuarterPickerInput.demo.valueFormat.vue?raw'
import DisabledDemo from './QuarterPickerInput.demo.disabled.vue'
import disabledCode from './QuarterPickerInput.demo.disabled.vue?raw'
import MinMaxDemo from './QuarterPickerInput.demo.minMax.vue'
import minMaxCode from './QuarterPickerInput.demo.minMax.vue?raw'
import PresetsDemo from './QuarterPickerInput.demo.presets.vue'
import presetsCode from './QuarterPickerInput.demo.presets.vue?raw'
import PresetsRangeDemo from './QuarterPickerInput.demo.presetsRange.vue'
import presetsRangeCode from './QuarterPickerInput.demo.presetsRange.vue?raw'
import MaxLevelDemo from './QuarterPickerInput.demo.maxLevel.vue'
import maxLevelCode from './QuarterPickerInput.demo.maxLevel.vue?raw'
import NativeLevelSelectDemo from './QuarterPickerInput.demo.nativeLevelSelect.vue'
import nativeLevelSelectCode from './QuarterPickerInput.demo.nativeLevelSelect.vue?raw'

export const QuarterPickerInputDemos = {
  usage: createVueDemo(UsageDemo, usageCode),
  multiple: createVueDemo(MultipleDemo, multipleCode),
  range: createVueDemo(RangeDemo, rangeCode),
  clearable: createVueDemo(ClearableDemo, clearableCode),
  modal: createVueDemo(ModalDemo, modalCode),
  valueFormat: createVueDemo(ValueFormatDemo, valueFormatCode),
  disabled: createVueDemo(DisabledDemo, disabledCode),
  minMax: createVueDemo(MinMaxDemo, minMaxCode),
  presets: createVueDemo(PresetsDemo, presetsCode),
  presetsRange: createVueDemo(PresetsRangeDemo, presetsRangeCode),
  maxLevel: createVueDemo(MaxLevelDemo, maxLevelCode),
  nativeLevelSelect: createVueDemo(NativeLevelSelectDemo, nativeLevelSelectCode),
}
