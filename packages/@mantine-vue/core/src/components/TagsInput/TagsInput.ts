import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import TagsInputComponent from './TagsInput.vue'

export const TagsInput = Object.assign(TagsInputComponent, {
  classes: { ...InputBase.classes, ...Combobox.classes },
})

export { getSplittedTags } from './get-splitted-tags'

export type {
  GetSplittedTagsInput,
  TagsInputOptionRenderPayload,
  TagsInputPillRenderPayload,
  TagsInputProps,
  TagsInputSlots,
  TagsInputStylesNames,
} from './TagsInput.types'
