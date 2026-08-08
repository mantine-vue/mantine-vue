import SegmentedControlComponent, { varsResolver } from './SegmentedControl.vue'
import classes from './SegmentedControl.module.css'
export const SegmentedControl = Object.assign(SegmentedControlComponent, { classes, varsResolver })
export type {
  SegmentedControlCssVariables,
  SegmentedControlItem,
  SegmentedControlOwnProps,
  SegmentedControlProps,
  SegmentedControlStylesNames,
} from './SegmentedControl.types'
