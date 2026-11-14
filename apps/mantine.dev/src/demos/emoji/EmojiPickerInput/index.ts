import { createVueDemo } from '@/demo'
import UsageDemo from './EmojiPickerInput.demo.usage.vue'
import usageCode from './EmojiPickerInput.demo.usage.vue?raw'
import ClearableDemo from './EmojiPickerInput.demo.clearable.vue'
import clearableCode from './EmojiPickerInput.demo.clearable.vue?raw'
import CloseOnSelectDemo from './EmojiPickerInput.demo.closeOnSelect.vue'
import closeOnSelectCode from './EmojiPickerInput.demo.closeOnSelect.vue?raw'
import DisabledDemo from './EmojiPickerInput.demo.disabled.vue'
import disabledCode from './EmojiPickerInput.demo.disabled.vue?raw'
import ReadOnlyDemo from './EmojiPickerInput.demo.readOnly.vue'
import readOnlyCode from './EmojiPickerInput.demo.readOnly.vue?raw'
import PickerPropsDemo from './EmojiPickerInput.demo.pickerProps.vue'
import pickerPropsCode from './EmojiPickerInput.demo.pickerProps.vue?raw'

export const EmojiPickerInputDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { maxWidth: 340, withPadding: true }),
  clearable: createVueDemo(ClearableDemo, clearableCode, { maxWidth: 340, withPadding: true }),
  closeOnSelect: createVueDemo(CloseOnSelectDemo, closeOnSelectCode, {
    maxWidth: 340,
    withPadding: true,
  }),
  disabled: createVueDemo(DisabledDemo, disabledCode, { maxWidth: 340, withPadding: true }),
  readOnly: createVueDemo(ReadOnlyDemo, readOnlyCode, { maxWidth: 340, withPadding: true }),
  pickerProps: createVueDemo(PickerPropsDemo, pickerPropsCode, {
    maxWidth: 340,
    withPadding: true,
  }),
}
