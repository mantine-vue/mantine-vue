import { createVueDemo } from '@/demo'
import UsageDemo from './WeekPicker.demo.usage.vue'
import usageCode from './WeekPicker.demo.usage.vue?raw'
import DeselectDemo from './WeekPicker.demo.deselect.vue'
import deselectCode from './WeekPicker.demo.deselect.vue?raw'
import MultipleDemo from './WeekPicker.demo.multiple.vue'
import multipleCode from './WeekPicker.demo.multiple.vue?raw'
import RangeDemo from './WeekPicker.demo.range.vue'
import rangeCode from './WeekPicker.demo.range.vue?raw'
import WeekValueDemo from './WeekPicker.demo.weekValue.vue'
import weekValueCode from './WeekPicker.demo.weekValue.vue?raw'
import FirstDayOfWeekDemo from './WeekPicker.demo.firstDayOfWeek.vue'
import firstDayOfWeekCode from './WeekPicker.demo.firstDayOfWeek.vue?raw'
import WeekControlPropsDemo from './WeekPicker.demo.weekControlProps.vue'
import weekControlPropsCode from './WeekPicker.demo.weekControlProps.vue?raw'
import MinMaxDemo from './WeekPicker.demo.minMax.vue'
import minMaxCode from './WeekPicker.demo.minMax.vue?raw'
import ExcludeDateDemo from './WeekPicker.demo.excludeDate.vue'
import excludeDateCode from './WeekPicker.demo.excludeDate.vue?raw'
import DefaultDateDemo from './WeekPicker.demo.defaultDate.vue'
import defaultDateCode from './WeekPicker.demo.defaultDate.vue?raw'
import HideOutsideDatesDemo from './WeekPicker.demo.hideOutsideDates.vue'
import hideOutsideDatesCode from './WeekPicker.demo.hideOutsideDates.vue?raw'
import ControlPropsDemo from './WeekPicker.demo.controlProps.vue'
import controlPropsCode from './WeekPicker.demo.controlProps.vue?raw'
import PresetsDemo from './WeekPicker.demo.presets.vue'
import presetsCode from './WeekPicker.demo.presets.vue?raw'
import PresetsRangeDemo from './WeekPicker.demo.presetsRange.vue'
import presetsRangeCode from './WeekPicker.demo.presetsRange.vue?raw'
import NumberOfColumnsDemo from './WeekPicker.demo.numberOfColumns.vue'
import numberOfColumnsCode from './WeekPicker.demo.numberOfColumns.vue?raw'
import MaxLevelDemo from './WeekPicker.demo.maxLevel.vue'
import maxLevelCode from './WeekPicker.demo.maxLevel.vue?raw'
import FullWidthDemo from './WeekPicker.demo.fullWidth.vue'
import fullWidthCode from './WeekPicker.demo.fullWidth.vue?raw'
import LocaleDemo from './WeekPicker.demo.locale.vue'
import localeCode from './WeekPicker.demo.locale.vue?raw'
import NativeLevelSelectDemo from './WeekPicker.demo.nativeLevelSelect.vue'
import nativeLevelSelectCode from './WeekPicker.demo.nativeLevelSelect.vue?raw'

export const WeekPickerDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { centered: true }),
  deselect: createVueDemo(DeselectDemo, deselectCode, { centered: true }),
  multiple: createVueDemo(MultipleDemo, multipleCode, { centered: true }),
  range: createVueDemo(RangeDemo, rangeCode, { centered: true }),
  weekValue: createVueDemo(WeekValueDemo, weekValueCode, { centered: true }),
  firstDayOfWeek: createVueDemo(FirstDayOfWeekDemo, firstDayOfWeekCode, { centered: true }),
  weekControlProps: createVueDemo(WeekControlPropsDemo, weekControlPropsCode, { centered: true }),
  minMax: createVueDemo(MinMaxDemo, minMaxCode, { centered: true }),
  excludeDate: createVueDemo(ExcludeDateDemo, excludeDateCode, { centered: true }),
  defaultDate: createVueDemo(DefaultDateDemo, defaultDateCode, { centered: true }),
  hideOutsideDates: createVueDemo(HideOutsideDatesDemo, hideOutsideDatesCode, { centered: true }),
  controlProps: createVueDemo(ControlPropsDemo, controlPropsCode, { centered: true }),
  presets: createVueDemo(PresetsDemo, presetsCode, { centered: true }),
  presetsRange: createVueDemo(PresetsRangeDemo, presetsRangeCode, { centered: true }),
  numberOfColumns: createVueDemo(NumberOfColumnsDemo, numberOfColumnsCode, { centered: true }),
  maxLevel: createVueDemo(MaxLevelDemo, maxLevelCode, { centered: true }),
  fullWidth: createVueDemo(FullWidthDemo, fullWidthCode),
  locale: createVueDemo(LocaleDemo, localeCode, { centered: true }),
  nativeLevelSelect: createVueDemo(NativeLevelSelectDemo, nativeLevelSelectCode, {
    centered: true,
  }),
}
