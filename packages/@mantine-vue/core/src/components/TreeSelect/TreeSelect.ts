import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import TreeSelectComponent from './TreeSelect.vue'
import TreeSelectOptionComponent from './TreeSelectOption.vue'
import classes from './TreeSelect.module.css'

export const TreeSelectOption = TreeSelectOptionComponent

export const TreeSelect = Object.assign(TreeSelectComponent, {
  classes: { ...InputBase.classes, ...Combobox.classes, ...classes },
})

export type { TreeSelectOptionProps } from './TreeSelectOption.vue'
export type {
  CheckedStrategy,
  TreeSelectChevronAriaLabels,
  TreeSelectMode,
  TreeSelectProps,
  TreeSelectRenderNodePayload,
  TreeSelectSlots,
  TreeSelectValue,
} from './TreeSelect.types'
