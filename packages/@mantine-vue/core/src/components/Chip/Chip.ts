import { withBoxProps } from '../../core'
import { ChipGroup } from './ChipGroup/ChipGroup'
import ChipComponent, { varsResolver } from './Chip.vue'
import classes from './Chip.module.css'

export const Chip = withBoxProps(
  Object.assign(ChipComponent, {
    classes,
    varsResolver,
    Group: ChipGroup,
  }),
)

export type {
  ChipCssVariables,
  ChipIconSlotProps,
  ChipOwnProps,
  ChipProps,
  ChipSlots,
  ChipStylesNames,
  ChipVariant,
} from './Chip.types'
