import { createVueDemo } from '@/demo'
import UsageDemo from './EmojiPickerPopover.demo.usage.vue'
import usageCode from './EmojiPickerPopover.demo.usage.vue?raw'
import CloseOnSelectDemo from './EmojiPickerPopover.demo.closeOnSelect.vue'
import closeOnSelectCode from './EmojiPickerPopover.demo.closeOnSelect.vue?raw'
import PickerPropsDemo from './EmojiPickerPopover.demo.pickerProps.vue'
import pickerPropsCode from './EmojiPickerPopover.demo.pickerProps.vue?raw'

export const EmojiPickerPopoverDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { centered: true }),
  closeOnSelect: createVueDemo(CloseOnSelectDemo, closeOnSelectCode, { centered: true }),
  pickerProps: createVueDemo(PickerPropsDemo, pickerPropsCode, { centered: true }),
}
