import { createVueDemo } from '@/demo'
import UsageDemo from './QuarterPicker.demo.usage.vue'
import usageCode from './QuarterPicker.demo.usage.vue?raw'
import DeselectDemo from './QuarterPicker.demo.deselect.vue'
import deselectCode from './QuarterPicker.demo.deselect.vue?raw'
import MultipleDemo from './QuarterPicker.demo.multiple.vue'
import multipleCode from './QuarterPicker.demo.multiple.vue?raw'
import RangeDemo from './QuarterPicker.demo.range.vue'
import rangeCode from './QuarterPicker.demo.range.vue?raw'
import PresetsDemo from './QuarterPicker.demo.presets.vue'
import presetsCode from './QuarterPicker.demo.presets.vue?raw'
import PresetsRangeDemo from './QuarterPicker.demo.presetsRange.vue'
import presetsRangeCode from './QuarterPicker.demo.presetsRange.vue?raw'
import DefaultDateDemo from './QuarterPicker.demo.defaultDate.vue'
import defaultDateCode from './QuarterPicker.demo.defaultDate.vue?raw'
import MinMaxDemo from './QuarterPicker.demo.minMax.vue'
import minMaxCode from './QuarterPicker.demo.minMax.vue?raw'
import ControlPropsDemo from './QuarterPicker.demo.controlProps.vue'
import controlPropsCode from './QuarterPicker.demo.controlProps.vue?raw'
import NumberOfColumnsDemo from './QuarterPicker.demo.numberOfColumns.vue'
import numberOfColumnsCode from './QuarterPicker.demo.numberOfColumns.vue?raw'
import MaxLevelDemo from './QuarterPicker.demo.maxLevel.vue'
import maxLevelCode from './QuarterPicker.demo.maxLevel.vue?raw'
import FullWidthDemo from './QuarterPicker.demo.fullWidth.vue'
import fullWidthCode from './QuarterPicker.demo.fullWidth.vue?raw'
import ListFormatDemo from './QuarterPicker.demo.listFormat.vue'
import listFormatCode from './QuarterPicker.demo.listFormat.vue?raw'
import LabelFormatDemo from './QuarterPicker.demo.labelFormat.vue'
import labelFormatCode from './QuarterPicker.demo.labelFormat.vue?raw'
import LocaleDemo from './QuarterPicker.demo.locale.vue'
import localeCode from './QuarterPicker.demo.locale.vue?raw'
import NativeLevelSelectDemo from './QuarterPicker.demo.nativeLevelSelect.vue'
import nativeLevelSelectCode from './QuarterPicker.demo.nativeLevelSelect.vue?raw'

export const QuarterPickerDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { centered: true }),
  deselect: createVueDemo(DeselectDemo, deselectCode, { centered: true }),
  multiple: createVueDemo(MultipleDemo, multipleCode, { centered: true }),
  range: createVueDemo(RangeDemo, rangeCode, { centered: true }),
  presets: createVueDemo(PresetsDemo, presetsCode, { centered: true }),
  presetsRange: createVueDemo(PresetsRangeDemo, presetsRangeCode, { centered: true }),
  defaultDate: createVueDemo(DefaultDateDemo, defaultDateCode, { centered: true }),
  minMax: createVueDemo(MinMaxDemo, minMaxCode, { centered: true }),
  controlProps: createVueDemo(ControlPropsDemo, controlPropsCode, { centered: true }),
  numberOfColumns: createVueDemo(NumberOfColumnsDemo, numberOfColumnsCode, { centered: true }),
  maxLevel: createVueDemo(MaxLevelDemo, maxLevelCode, { centered: true }),
  fullWidth: createVueDemo(FullWidthDemo, fullWidthCode),
  listFormat: createVueDemo(ListFormatDemo, listFormatCode, { centered: true }),
  labelFormat: createVueDemo(LabelFormatDemo, labelFormatCode, { centered: true }),
  locale: createVueDemo(LocaleDemo, localeCode, { centered: true }),
  nativeLevelSelect: createVueDemo(NativeLevelSelectDemo, nativeLevelSelectCode, {
    centered: true,
  }),
}
