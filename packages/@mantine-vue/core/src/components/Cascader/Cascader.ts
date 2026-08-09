import { Combobox } from '../Combobox'
import { InputBase } from '../InputBase'
import CascaderComponent from './Cascader.vue'
import classes from './Cascader.module.css'

export const Cascader = Object.assign(CascaderComponent, {
  classes: { ...InputBase.classes, ...Combobox.classes, ...classes },
})

export type {
  CascaderFormatValue,
  CascaderFormatValueInput,
  CascaderOption,
  CascaderProps,
  CascaderSlots,
} from './Cascader.types'
