import { createVueDemo } from '@/demo'
import UsageDemo from './EmojiPicker.demo.usage.vue'
import usageCode from './EmojiPicker.demo.usage.vue?raw'
import SizeDemo from './EmojiPicker.demo.size.vue'
import sizeCode from './EmojiPicker.demo.size.vue?raw'
import NoSearchDemo from './EmojiPicker.demo.noSearch.vue'
import noSearchCode from './EmojiPicker.demo.noSearch.vue?raw'
import NoPreviewDemo from './EmojiPicker.demo.noPreview.vue'
import noPreviewCode from './EmojiPicker.demo.noPreview.vue?raw'
import ColumnsDemo from './EmojiPicker.demo.columns.vue'
import columnsCode from './EmojiPicker.demo.columns.vue?raw'
import EmojiSizeDemo from './EmojiPicker.demo.emojiSize.vue'
import emojiSizeCode from './EmojiPicker.demo.emojiSize.vue?raw'
import SkinToneDemo from './EmojiPicker.demo.skinTone.vue'
import skinToneCode from './EmojiPicker.demo.skinTone.vue?raw'
import ScrollAreaDemo from './EmojiPicker.demo.scrollArea.vue'
import scrollAreaCode from './EmojiPicker.demo.scrollArea.vue?raw'
import CategoryLabelsDemo from './EmojiPicker.demo.categoryLabels.vue'
import categoryLabelsCode from './EmojiPicker.demo.categoryLabels.vue?raw'
import SearchIconDemo from './EmojiPicker.demo.searchIcon.vue'
import searchIconCode from './EmojiPicker.demo.searchIcon.vue?raw'
import EmptySearchDemo from './EmojiPicker.demo.emptySearch.vue'
import emptySearchCode from './EmojiPicker.demo.emptySearch.vue?raw'
import ToggleSectionsDemo from './EmojiPicker.demo.toggleSections.vue'
import toggleSectionsCode from './EmojiPicker.demo.toggleSections.vue?raw'

export const EmojiPickerDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { centered: true }),
  size: createVueDemo(SizeDemo, sizeCode, { centered: true }),
  noSearch: createVueDemo(NoSearchDemo, noSearchCode, { centered: true }),
  noPreview: createVueDemo(NoPreviewDemo, noPreviewCode, { centered: true }),
  columns: createVueDemo(ColumnsDemo, columnsCode, { centered: true }),
  emojiSize: createVueDemo(EmojiSizeDemo, emojiSizeCode, { centered: true }),
  skinTone: createVueDemo(SkinToneDemo, skinToneCode, { centered: true }),
  scrollArea: createVueDemo(ScrollAreaDemo, scrollAreaCode, { centered: true }),
  categoryLabels: createVueDemo(CategoryLabelsDemo, categoryLabelsCode, { centered: true }),
  searchIcon: createVueDemo(SearchIconDemo, searchIconCode, { centered: true }),
  emptySearch: createVueDemo(EmptySearchDemo, emptySearchCode, { centered: true }),
  toggleSections: createVueDemo(ToggleSectionsDemo, toggleSectionsCode, { centered: true }),
}
